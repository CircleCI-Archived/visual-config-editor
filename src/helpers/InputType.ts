export function InputType(elements: {}[]) {
    if (elements.length === 0) {
        return 'input';
      }
      else {
        return 'default';
      }
}