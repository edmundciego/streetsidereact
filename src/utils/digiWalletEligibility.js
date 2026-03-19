export const isBelizeDigiWalletEligible = (profileInfo) => {
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

export const filterDigiWalletMethods = (methods, profileInfo) => {
  if (!Array.isArray(methods)) {
    return methods
  }

  const allowDigiWallet = isBelizeDigiWalletEligible(profileInfo)
  return methods.filter((method) => {
    const gateway = String(method?.gateway ?? "").toLowerCase()
    if (gateway !== "digiwallet") {
      return true
    }

    return allowDigiWallet
  })
}
