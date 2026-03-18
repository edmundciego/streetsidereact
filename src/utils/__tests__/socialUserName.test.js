const {
  buildFullName,
  splitNameParts,
  resolveNameParts,
  getGoogleNameParts,
  getFacebookNameParts,
  getAppleNameParts,
} = require("../socialUserName");

describe("socialUserName", () => {
  it("builds a full name from first and last name", () => {
    expect(buildFullName("  Edmund ", " Ciego ")).toBe("Edmund Ciego");
    expect(buildFullName("Edmund", "")).toBe("Edmund");
  });

  it("splits a full name into first and last name", () => {
    expect(splitNameParts("Edmund Ciego")).toEqual({
      f_name: "Edmund",
      l_name: "Ciego",
      name: "Edmund Ciego",
    });

    expect(splitNameParts("Mary Jane Watson")).toEqual({
      f_name: "Mary",
      l_name: "Jane Watson",
      name: "Mary Jane Watson",
    });
  });

  it("prefers explicit first and last name over a combined name", () => {
    expect(
      resolveNameParts({
        firstName: "Mary Jane",
        lastName: "Watson Parker",
        fullName: "Ignored Name",
      })
    ).toEqual({
      f_name: "Mary Jane",
      l_name: "Watson Parker",
      name: "Mary Jane Watson Parker",
    });
  });

  it("derives Google names from given_name and family_name", () => {
    expect(
      getGoogleNameParts({
        given_name: "Edmund",
        family_name: "Ciego",
        name: "Wrong Fallback",
      })
    ).toEqual({
      f_name: "Edmund",
      l_name: "Ciego",
      name: "Edmund Ciego",
    });
  });

  it("derives Facebook names from the combined name", () => {
    expect(
      getFacebookNameParts({
        name: "Edmund Ciego",
      })
    ).toEqual({
      f_name: "Edmund",
      l_name: "Ciego",
      name: "Edmund Ciego",
    });
  });

  it("derives Apple names from the popup response", () => {
    expect(
      getAppleNameParts(
        {
          user: {
            name: {
              firstName: "Edmund",
              lastName: "Ciego",
            },
          },
        },
        {}
      )
    ).toEqual({
      f_name: "Edmund",
      l_name: "Ciego",
      name: "Edmund Ciego",
    });
  });
});
