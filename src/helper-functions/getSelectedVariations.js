// Cart normalization is shared data logic. Keep it independent of navbar UI
// so importing it cannot pull authentication, maps, and drawers into a page.
export const getSelectedVariations = (variations) => {
  const selectedItem = [];
  if (!(variations?.length > 0)) return selectedItem;
  variations?.forEach((item, choiceIndex) => {
    item?.values?.forEach((value, optionIndex) => {
      if (value?.isSelected) {
        selectedItem.push({
          choiceIndex,
          isSelected: value.isSelected,
          label: value.label,
          optionIndex,
          optionPrice: value.optionPrice,
        });
      }
    });
  });
  return selectedItem;
};
