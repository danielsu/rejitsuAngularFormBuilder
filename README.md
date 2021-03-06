# Rejitsu Angular Form Builder

currently alpha version

## Form Schema Reference
This form schema can be used to define lightweight, full featured, complex forms.
Features include simple to use, user interaction support, single field validation, form validation with business logic, extendable.
Whilst this project contains a demo of an AngularJS form builder, the form can be rendered by any client side technology, e.g. HTML5, Java or even Swing or Adobe Flash if you like to.

## Top Level Form Details

- [x] **formName**: form name, prefix for HTML field IDs [formName]_[fieldName], needed for storage variable of ng-model, too
- [x] **groups**: (optional) [] Array of fields (may contain nested groups, see below)
- [x] **fields**: [] Array of field elements or groups with fields
- Storage of ng-model data: 'formData'+[formName].[fieldName], eg. formName = 'myForm', input = 'surname', model => 'formDatamyForm.surname'

## Fields
- **name** (Pflicht, muss für das Mapping der BPM Task-Variable gleichen, erhält beim Transfer an die BPM das Präfix map_[name])

## optional attributes: [x] = implemented, [ ] = todo
- [x] **id**: if not give use lower case [formname]_[name]
- [x] **label**: if not given use [name]
- [x] **required**: [true | false (default)]
- [ ] **disabled**: [ not implemented yet, rather done via addAttributes with ng-disable]
- [x] **readonly**: [true | false (default)]
- [x] **placeholder**: text for empty fields
- [x] **help**: text for tooltips
- [x] **addAttributes**: (specific, string containing any well defined HTML-Attributen, e.g. HTML5 or AngularJS, inserted 1:1)
- [x] **rows**: [number for text area only]
- [x] **showWhen**: [string, to be set on surrounding div of label and field]
-- String as expression, e.g. angular expression showWhen: 'formDatademoForm.checkboxShowMore==true'
-- model storage name: 'formData'+[formName].[fieldName]
- [x] **options**: for types radio, checkbox and select, array [] with simple strings oder key-value objects
-- Array with simple strings, e.g.. ['red', 'green', 'blue'], Attention: Given Text will be transferred as value and is URL encoded, whitespace = %20
-- Array with key-value objects [{ label:'[string]', value:'[string | number]'}]
-- e.g. Favorite vacation destination = [{label:'Beach and Sea', value:'beach'},{label:'Mountains for walking and climbing', value:'mountains'},{label:'Big City Adventure', value:'city'}]
- **type**: [ (no type given (default) = text) |
  -    [x] checkbox (single chechbox or multiple if options-attribute is used)|
  -    [ ] color |
  -    [ ] date |
  -    [ ] datetime |
  -    [ ] datetime-local |
  -    [ ] email |
  -    [ ] month |
  -    [ ] number |
  -    [x] radio (use options-attribute) |
  -    [ ] range |
  -    [ ] search |
  -    [x] select (use options-attribute) |
  -    [ ] tel |
  -    [x] text (default) |
  -    [ ] time |
  -    [ ] url |
  -    [ ] week ]
- special types:
  -    [x] textarea (use rows-attribute)
  -    [ ] button
  -    [x] submit  calls function given via directive with `fn(Object:formDataObject, boolean:isFormValid)`
  -    [ ] pattern (with pattern and hint / explanation)

## Output
- [x] Output order according to appearance in JSON
- [x] show empty groups
- [x] show error message for empty groups and empty form

## Group Details
- [x] **groupName**: mandatory
- [x] **groupLabel**: (optional, handling like with input types)
- [x] **fields**: [] array of fields or nested groups

## TO DO
- [x] ngModel
- [x] form definition to be first entry
- [x] get all single field values
- [ ] get all multi field values, e.g. multiple options as in checkboxes, select ...
- [ ] do ngModel multi selection on checkboxes?
- [x] do URL encode all values
- [ ] do buttons and actions
- [ ] do check ID are unique or is same ID used more than once
