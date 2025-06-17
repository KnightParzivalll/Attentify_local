export const encryptPayload = async (
	key: string,
	payload: object
): Promise<string> => {
	const encoder = new TextEncoder()
	const data = encoder.encode(JSON.stringify(payload))
	const cryptoKey = await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(key).slice(0, 32),
		'AES-GCM',
		false,
		['encrypt']
	)
	const iv = crypto.getRandomValues(new Uint8Array(12))

	const encrypted = await crypto.subtle.encrypt(
		{
			name: 'AES-GCM',
			iv
		},
		cryptoKey,
		data
	)

	const combined = new Uint8Array(iv.byteLength + encrypted.byteLength)
	combined.set(iv, 0)
	combined.set(new Uint8Array(encrypted), iv.byteLength)

	return btoa(String.fromCharCode(...combined))
}
