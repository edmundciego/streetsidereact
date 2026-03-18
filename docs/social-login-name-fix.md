# Social Login Name Fix

## Summary

This fixes the issue where social sign-in was not reliably saving the customer's real first and last name. In some cases the app was falling back to a username-style value instead of preserving the provider's actual name data.

## What Changed

### Frontend

- Added name normalization helpers in `src/utils/socialUserName.js`
- Updated Google login to preserve `given_name` and `family_name`
- Updated Facebook login to split the provider full name once and keep it through onboarding
- Updated Apple login to use the name returned from the Apple popup response when available
- Updated the add-user-info modal to use separate `First Name` and `Last Name` fields instead of a single `Name` field
- Updated the auth modal to pass the correct social user object through the onboarding flow

## Expected Result

For new social sign-ins:

- Google should save the correct first and last name
- Facebook should save the correct first and last name
- Apple should save the correct first and last name when Apple returns it

For existing users already saved with incorrect names:

- This change does not automatically repair old records
- A one-time cleanup would be needed if those accounts should be corrected in bulk

## Apple Limitation

Apple may only return the user's name on the first successful authorization for a given app. On later logins, Apple can return the token and email without the name.

That means:

- New Apple sign-ins can capture the real name if Apple sends it
- Existing Apple users with bad names will not be auto-corrected unless we run a cleanup or the user updates profile data manually

## Files Touched

- `src/utils/socialUserName.js`
- `src/utils/__tests__/socialUserName.test.js`
- `src/components/auth/sign-in/social-login/GoogleLoginComp.js`
- `src/components/auth/sign-in/social-login/FbLoginComp.js`
- `src/components/auth/sign-in/social-login/AppleLoginComp.js`
- `src/components/auth/AddUserInfo.jsx`
- `src/components/auth/AuthModal.jsx`

## Verification

- `npm test -- socialUserName authGuardRules socialLoginConfig paymentFailureHandler digiWalletState`
- Result: `25/25` tests passed

## Recommended QA

1. Test new Google sign-up and confirm profile shows correct first and last name.
2. Test new Facebook sign-up and confirm profile shows correct first and last name.
3. Test new Apple sign-up with a first-time Apple authorization and confirm profile shows correct first and last name.
4. Test the add-user-info modal and confirm both names persist after completion.
5. Test profile editing and confirm existing profile updates still save correctly.
