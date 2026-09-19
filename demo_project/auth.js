// Authentication Module (UNSAFE DEMO FILE)
// Contains demo access token.

const ACCESS_TOKEN = "FAKE_TOKEN_456789";

function getAuthHeader() {
  return {
    "Authorization": `Bearer ${ACCESS_TOKEN}`
  };
}

module.exports = { getAuthHeader };
