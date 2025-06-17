// contexts/AuthContext.tsx
import getProfile from 'api/getProfile'
import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useReducer
} from 'react'
import type { UserProfileResponse } from 'types/profile'

type UserProfile = UserProfileResponse
type AuthState = {
	user: UserProfile | null
	token: string | null
	isLoading: boolean
	error: Error | null
	isInitialized: boolean // Track initialization status
}

type AuthContextType = {
	state: AuthState
	// cookieLogin: (email: string, password: string) => Promise<void>
	tokenLogin: (email: string, password: string) => Promise<void>
	logout: () => void
} & Pick<AuthState, 'user' | 'token'>

type AuthAction =
	| { type: 'INITIALIZE' }
	| { type: 'LOGIN_START' }
	// | { type: 'LOGIN_SUCCESS'; payload: UserProfile }
	| {
			type: 'LOGIN_SUCCESS'
			payload: { user: UserProfileResponse; token: string }
	  }
	| { type: 'LOGIN_FAILURE'; payload: Error }
	| { type: 'LOGOUT' }

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
	switch (action.type) {
		case 'INITIALIZE':
			return { ...state, isLoading: true, isInitialized: false }
		case 'LOGIN_START':
			return { ...state, isLoading: true, error: null }
		case 'LOGIN_SUCCESS':
			return {
				...state,
				user: action.payload.user,
				token: action.payload.token,
				isLoading: false,
				error: null,
				isInitialized: true // Mark as initialized
			}
		case 'LOGIN_FAILURE':
			return {
				...state,
				user: null,
				token: null,
				isLoading: false,
				error: action.payload,
				isInitialized: true
			}
		case 'LOGOUT':
			return {
				...state,
				user: null,
				token: null,
				isLoading: false,
				error: null,
				isInitialized: true
			}
		default:
			return state
	}
}

const initializeState = (): AuthState => {
	if (typeof window === 'undefined') {
		return {
			user: null,
			token: null,
			isLoading: false,
			error: null,
			isInitialized: false
		}
	}

	const storedUser = localStorage.getItem('user')
	const storedToken = localStorage.getItem('token')

	return {
		user: storedUser ? JSON.parse(storedUser) : null,
		token: storedToken ?? null,
		isLoading: false,
		error: null,
		isInitialized: false // Start uninitialized
	}
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(authReducer, initializeState())

	// const fetchProfile = useCallback(async () => {
	// 	try {
	// 		dispatch({ type: 'LOGIN_START' })
	// 		const profile = await getProfile()
	// 		dispatch({ type: 'LOGIN_SUCCESS', payload: profile })
	// 	} catch (error) {
	// 		dispatch({ type: 'LOGIN_FAILURE', payload: error as Error })
	// 	}
	// }, [])

	const fetchProfile = useCallback(async () => {
		if (!state.token) return

		try {
			dispatch({ type: 'LOGIN_START' })
			const profile = await getProfile(state.token)
			dispatch({
				type: 'LOGIN_SUCCESS',
				payload: { user: profile, token: state.token }
			})
		} catch (error) {
			dispatch({ type: 'LOGIN_FAILURE', payload: error as Error })
		}
	}, [state.token])

	// // Initial profile load (runs only once)
	// useEffect(() => {
	// 	if (state.user && !state.isInitialized) {
	// 		fetchProfile()
	// 	}
	// }, [fetchProfile, state.user, state.isInitialized])

	// Load profile if token exists on init
	useEffect(() => {
		if (state.token && !state.isInitialized) {
			fetchProfile()
		}
	}, [fetchProfile, state.token, state.isInitialized])

	// Persist to localStorage
	// useEffect(() => {
	// 	if (state.user) {
	// 		localStorage.setItem('user', JSON.stringify(state.user))
	// 	} else {
	// 		localStorage.removeItem('user')
	// 	}
	// }, [state.user])

	// Persist user + token to localStorage
	useEffect(() => {
		if (state.user && state.token) {
			localStorage.setItem('user', JSON.stringify(state.user))
			localStorage.setItem('token', state.token)
		} else {
			localStorage.removeItem('user')
			localStorage.removeItem('token')
		}
	}, [state.user, state.token])

	// const cookieLogin = useCallback(
	// 	async (email: string, password: string) => {
	// 		dispatch({ type: 'LOGIN_START' })

	// 		try {
	// 			const params = new URLSearchParams()
	// 			params.append('username', email)
	// 			params.append('password', password)

	// 			const response = await fetch(
	// 				`${import.meta.env.VITE_API_URL}/auth/cookie/login`,
	// 				{
	// 					method: 'POST',
	// 					headers: {
	// 						'Content-Type': 'application/x-www-form-urlencoded',
	// 						accept: 'application/json'
	// 					},
	// 					credentials: 'include',
	// 					body: params.toString()
	// 				}
	// 			)

	// 			if (!response.ok) throw new Error('Login failed')
	// 			await fetchProfile()
	// 		} catch (error) {
	// 			dispatch({ type: 'LOGIN_FAILURE', payload: error as Error })
	// 			throw error
	// 		}
	// 	},
	// 	[fetchProfile]
	// )

	const tokenLogin = useCallback(async (email: string, password: string) => {
		dispatch({ type: 'LOGIN_START' })

		try {
			const params = new URLSearchParams()
			params.append('username', email)
			params.append('password', password)

			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/auth/jwt/login`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Accept: 'application/json'
					},
					body: params.toString()
				}
			)

			if (!response.ok) throw new Error('Login failed')

			const data = await response.json()
			const token = data.access_token

			if (!token) throw new Error('No token returned')

			// Fetch profile with the new token
			const profile = await getProfile(token)

			dispatch({ type: 'LOGIN_SUCCESS', payload: { user: profile, token } })
		} catch (error) {
			dispatch({ type: 'LOGIN_FAILURE', payload: error as Error })
			throw error
		}
	}, [])

	// const logout = useCallback(() => {
	// 	dispatch({ type: 'LOGOUT' })

	// 	fetch(`${import.meta.env.VITE_API_URL}/auth/cookie/logout`, {
	// 		method: 'POST',
	// 		credentials: 'include'
	// 	}).catch(console.error)
	// }, [])

	const logout = useCallback(() => {
		dispatch({ type: 'LOGOUT' })
		fetch(`${import.meta.env.VITE_API_URL}/auth/jwt/logout`, {
			method: 'POST'
		}).catch(console.error)

		localStorage.removeItem('user')
		localStorage.removeItem('token')
	}, [])

	return (
		<AuthContext.Provider
			value={{
				state,
				user: state.user,
				token: state.token,
				// cookieLogin,
				tokenLogin,
				logout
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
