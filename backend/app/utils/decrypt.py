from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from base64 import b64decode
import json


def decrypt_payload(encrypted_data: str, session_key: str) -> dict:
    """
    Decrypts base64-encoded AES-GCM payload coming from QR code.

    Args:
        encrypted_data (str): base64-encoded string from QR code
        session_key (str): 32-byte session key used for AES-GCM

    Returns:
        dict: Decrypted JSON payload
    """
    try:
        # Decode base64 to bytes
        combined = b64decode(encrypted_data)

        # Split IV (first 12 bytes) and ciphertext
        iv = combined[:12]
        ciphertext = combined[12:]

        # Prepare 32-byte key (matching JS slice logic)
        key_bytes = session_key.encode("utf-8")[:32]

        # AES-GCM decryption
        aesgcm = AESGCM(key_bytes)
        decrypted_data = aesgcm.decrypt(iv, ciphertext, None)

        # Decode JSON
        payload = json.loads(decrypted_data.decode("utf-8"))
        return payload

    except Exception as e:
        raise ValueError(f"Failed to decrypt QR data: {e}")
