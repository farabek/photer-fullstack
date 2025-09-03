import { Children, ReactElement, ReactNode } from 'react';

/**
 * Validates that there are no duplicate `props.value` in the given array of children.
 * @throws {Error} If duplicate `props.value` is found.
 * @param children
 */
export function validateChildrenValues(children: ReactNode): undefined {
  const childrenArray = Children.toArray(children) as ReactElement<{
    value: string;
  }>[];
  const values = childrenArray.map((child) => child.props.value);
  const uniqueValues = new Set(values);

  if (values.length !== uniqueValues.size) {
    throw new Error(
      `There can't be two or more Select Items with the same value`
    );
  }
}
