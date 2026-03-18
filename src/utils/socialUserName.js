const normalizeNameValue = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/\s+/g, " ");
};

export const buildFullName = (firstName = "", lastName = "") => {
  const normalizedFirstName = normalizeNameValue(firstName);
  const normalizedLastName = normalizeNameValue(lastName);

  return [normalizedFirstName, normalizedLastName].filter(Boolean).join(" ");
};

export const splitNameParts = (fullName = "") => {
  const normalizedFullName = normalizeNameValue(fullName);

  if (!normalizedFullName) {
    return { f_name: "", l_name: "", name: "" };
  }

  const [firstName, ...lastNameParts] = normalizedFullName.split(" ");
  const lastName = lastNameParts.join(" ");

  return {
    f_name: firstName,
    l_name: lastName,
    name: buildFullName(firstName, lastName),
  };
};

export const resolveNameParts = ({
  firstName = "",
  lastName = "",
  fullName = "",
} = {}) => {
  const normalizedFirstName = normalizeNameValue(firstName);
  const normalizedLastName = normalizeNameValue(lastName);

  if (normalizedFirstName || normalizedLastName) {
    return {
      f_name: normalizedFirstName,
      l_name: normalizedLastName,
      name: buildFullName(normalizedFirstName, normalizedLastName),
    };
  }

  return splitNameParts(fullName);
};

const getAppleNameSource = (response = {}) => {
  if (response?.user?.name && typeof response.user.name === "object") {
    return response.user.name;
  }

  if (response?.name && typeof response.name === "object") {
    return response.name;
  }

  if (response?.fullName && typeof response.fullName === "object") {
    return response.fullName;
  }

  return {};
};

export const getGoogleNameParts = (user = {}) => {
  return resolveNameParts({
    firstName: user?.given_name,
    lastName: user?.family_name,
    fullName: user?.name,
  });
};

export const getFacebookNameParts = (user = {}) => {
  return resolveNameParts({
    fullName: user?.name,
  });
};

export const getAppleNameParts = (response = {}, decodedUser = {}) => {
  const appleNameSource = getAppleNameSource(response);

  return resolveNameParts({
    firstName:
      appleNameSource?.firstName ??
      appleNameSource?.givenName ??
      response?.firstName,
    lastName:
      appleNameSource?.lastName ??
      appleNameSource?.familyName ??
      response?.lastName,
    fullName:
      (typeof response?.name === "string" ? response.name : "") ||
      decodedUser?.name,
  });
};
