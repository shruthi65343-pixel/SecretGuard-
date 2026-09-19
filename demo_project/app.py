import os

# Sample Application Code (UNSAFE DEMO FILE FOR SECRETGUARD SCANNER)
# This file contains demo test credentials to demonstrate secret detection.

API_KEY = "FAKE_API_KEY_123456"

def connect_to_service():
    print(f"Connecting to service using API key: {API_KEY[:4]}...")
    return True

if __name__ == "__main__":
    connect_to_service()
