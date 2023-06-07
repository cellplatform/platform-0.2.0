/**
 * Derive bolean ("is" flag) values about the current state.
 */
export const StateIs = {
  /**
   * Determine if an input element (ie. a textbox) is currently selected.
   */
  get inputSelected() {
    return StateIs.inputElement(document.activeElement);
  },

  /**
   * Determine if the given elmenet is an Input element.
   */
  inputElement(el: Element | null) {
    return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
  },
};
