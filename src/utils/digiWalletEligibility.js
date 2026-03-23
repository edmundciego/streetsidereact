const normalizeProfileSource = (profileSource) => {
  if (!profileSource) {
    return null
  }

  if (profileSource?.data && typeof profileSource.data === "object") {
    return profileSource.data
  }

  return profileSource
}

const resolveEligibilityProfile = (profileSources) => {
  const normalizedSources = profileSources
    .map(normalizeProfileSource)
    .filter(Boolean)

  return (
    normalizedSources.find(
      (profile) =>
        profile?.phone ||
        profile?.is_phone_verified !== undefined ||
        profile?.is_phone_verified !== null
    ) || normalizedSources[0] || null
  )
}

export const isBelizeDigiWalletEligible = (...profileSources) => {
  const profileInfo = resolveEligibilityProfile(profileSources)
  if (!profileInfo) {
    return false
  }

  const isVerified = Number(profileInfo?.is_phone_verified) === 1
  if (!isVerified) {
    return false
  }

  const digits = String(profileInfo?.phone ?? "").replace(/\D+/g, "")
  if (!digits) {
    return false
  }

  const belizeDigits = digits.length === 7 ? `501${digits}` : digits
  return belizeDigits.startsWith("501") && belizeDigits.length === 10
}

export const filterDigiWalletMethods = (methods, ...profileSources) => {
  if (!Array.isArray(methods)) {
    return methods
  }

  const allowDigiWallet = isBelizeDigiWalletEligible(...profileSources)
  return methods.filter((method) => {
    const gateway = String(method?.gateway ?? "").toLowerCase()
    if (gateway !== "digiwallet") {
      return true
    }

    return allowDigiWallet
  })
}
