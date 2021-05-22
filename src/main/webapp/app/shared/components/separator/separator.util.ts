import { IDatasourceConstraints, defaultValue } from 'app/shared/model/datasource-constraints.model';
export const addCommaSeparatedValuesIntoConstraint = (
  commaSeparatedValues: string,
  constraint: IDatasourceConstraints,
  condition: any,
  separator: string
) => {
  if (commaSeparatedValues && commaSeparatedValues.length > 0) {
    // getList = getList.filter((item, i, ar) => ar.indexOf(item) === i);
    // getList.forEach(element => {
    //     added({ text: element },constraint);
    //     constraint.selected.push({ text: element });
    // });
    // vm.commaSeparatedToolTip = VisualDispatchService.setcommaSeparatedToolTip(constraint.isCommaSeparatedInput);

    const index = constraint.constraintDefinition.featureConstraints.indexOf(condition);
    if (index > -1) {
      constraint.constraintDefinition.featureConstraints[index].values = commaSeparatedValues.split(separator);
    }
  }
  return constraint;
};
