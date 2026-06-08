import {
  PublicClientApplication,
  InteractionRequiredAuthError,
  type AccountInfo,
  type Configuration,
} from '@azure/msal-browser'
import { CLIENT_ID, AUTHORITY, REDIRECT_URI, GRAPH_SCOPES, isAuthConfigured } from './config'

const msalConfig: Configuration = {
  auth: {
    clientId: CLIENT_ID,
    authority: AUTHORITY,
    redirectUri: REDIRECT_URI,
  },
  cache: {
    // localStorage keeps the session across tabs/refreshes (still client-side only).
    cacheLocation: 'localStorage',
  },
}

export const msalInstance = new PublicClientApplication(msalConfig)

let initialized = false

/** MSAL v3 requires an explicit async initialize() before any other call. */
export async function ensureMsalReady(): Promise<void> {
  if (!isAuthConfigured) return
  if (!initialized) {
    await msalInstance.initialize()
    // Complete any redirect-based sign-in that may be in progress.
    await msalInstance.handleRedirectPromise()
    initialized = true
  }
}

export function getActiveAccount(): AccountInfo | null {
  const active = msalInstance.getActiveAccount()
  if (active) return active
  const all = msalInstance.getAllAccounts()
  if (all.length > 0) {
    msalInstance.setActiveAccount(all[0])
    return all[0]
  }
  return null
}

/** Interactive sign-in via popup. Returns the signed-in account. */
export async function signIn(): Promise<AccountInfo> {
  await ensureMsalReady()
  const result = await msalInstance.loginPopup({ scopes: GRAPH_SCOPES, prompt: 'select_account' })
  msalInstance.setActiveAccount(result.account)
  return result.account
}

export async function signOut(): Promise<void> {
  await ensureMsalReady()
  const account = getActiveAccount() ?? undefined
  await msalInstance.logoutPopup({ account })
}

/**
 * Acquire a Graph access token, silently when possible and falling back to an
 * interactive popup if the user needs to re-consent or re-authenticate.
 */
export async function getAccessToken(): Promise<string> {
  await ensureMsalReady()
  const account = getActiveAccount()
  if (!account) throw new Error('Not signed in')

  try {
    const result = await msalInstance.acquireTokenSilent({ scopes: GRAPH_SCOPES, account })
    return result.accessToken
  } catch (err) {
    if (err instanceof InteractionRequiredAuthError) {
      const result = await msalInstance.acquireTokenPopup({ scopes: GRAPH_SCOPES, account })
      return result.accessToken
    }
    throw err
  }
}
