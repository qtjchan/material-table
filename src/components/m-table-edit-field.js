import * as React from "react";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import DateFnsUtils from "@date-io/date-fns";
import {
  LocalizationProvider,
  TimePicker,
  DatePicker,
  DateTimePicker,
} from "@mui/lab";
import PropTypes from "prop-types";

class MTableEditField extends React.Component {
  getProps() {
    const {
      columnDef,
      rowData,
      onRowDataChange,
      errorState,
      ...props
    } = this.props;
    return props;
  }

  renderLookupField() {
    const { helperText, error, ...props } = this.getProps();
    return (
      <FormControl error={Boolean(error)}>
        <Select
          {...props}
          value={this.props.value === undefined ? "" : this.props.value}
          onChange={(event) => this.props.onChange(event.target.value)}
          style={{
            fontSize: 13,
          }}
          SelectDisplayProps={{ "aria-label": this.props.columnDef.title }}
        >
          {Object.keys(this.props.columnDef.lookup).map((key) => (
            <MenuItem key={key} value={key}>
              {this.props.columnDef.lookup[key]}
            </MenuItem>
          ))}
        </Select>
        {Boolean(helperText) && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    );
  }

  renderBooleanField() {
    const { helperText, error, ...props } = this.getProps();

    return (
      <FormControl error={error} component="fieldset">
        <FormGroup>
          <FormControlLabel
            label=""
            control={
              <Checkbox
                {...props}
                value={String(this.props.value)}
                checked={Boolean(this.props.value)}
                onChange={(event) => this.props.onChange(event.target.checked)}
                style={{
                  padding: 0,
                  width: 24,
                  marginLeft: 9,
                }}
                inputProps={{
                  "aria-label": this.props.columnDef.title,
                }}
              />
            }
          />
        </FormGroup>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    );
  }

  renderDateField() {
    return (
      <LocalizationProvider
        dateAdapter={DateFnsUtils}
        locale={this.props.locale}
      >
        <DatePicker
          {...this.getProps()}
          renderInput={(props) => <TextField {...props} />}
          format="dd.MM.yyyy"
          value={this.props.value || null}
          onChange={this.props.onChange}
          clearable
          InputProps={{
            style: {
              fontSize: 13,
            },
          }}
          inputProps={{
            "aria-label": `${this.props.columnDef.title}: press space to edit`,
          }}
        />
      </LocalizationProvider>
    );
  }

  renderTimeField() {
    return (
      <LocalizationProvider
        dateAdapter={DateFnsUtils}
        locale={this.props.locale}
      >
        <TimePicker
          {...this.getProps()}
          format="HH:mm:ss"
          renderInput={(props) => <TextField {...props} />}
          value={this.props.value || null}
          onChange={this.props.onChange}
          clearable
          InputProps={{
            style: {
              fontSize: 13,
            },
            inputProps: {
              "aria-label": `${this.props.columnDef.title}: press space to edit`,
            },
          }}
        />
      </LocalizationProvider>
    );
  }

  renderDateTimeField() {
    return (
      <LocalizationProvider
        dateAdapter={DateFnsUtils}
        locale={this.props.locale}
      >
        <DateTimePicker
          {...this.getProps()}
          format="dd.MM.yyyy HH:mm:ss"
          renderInput={(props) => <TextField {...props} />}
          value={this.props.value || null}
          onChange={this.props.onChange}
          clearable
          InputProps={{
            style: {
              fontSize: 13,
            },
            inputProps: {
              "aria-label": `${this.props.columnDef.title}: press space to edit`,
            },
          }}
        />
      </LocalizationProvider>
    );
  }

  renderTextField() {
    return (
      <TextField
        {...this.getProps()}
        fullWidth
        variant="standard"
        style={
          this.props.columnDef.type === "numeric" ? { float: "right" } : {}
        }
        type={this.props.columnDef.type === "numeric" ? "number" : "text"}
        placeholder={
          this.props.columnDef.editPlaceholder || this.props.columnDef.title
        }
        value={this.props.value === undefined ? "" : this.props.value}
        onChange={(event) =>
          this.props.onChange(
            this.props.columnDef.type === "numeric"
              ? event.target.valueAsNumber
              : event.target.value
          )
        }
        InputProps={{
          style: {
            fontSize: 13,
          },
          inputProps: {
            "aria-label": this.props.columnDef.title,
          },
        }}
      />
    );
  }

  renderCurrencyField() {
    return (
      <TextField
        {...this.getProps()}
        placeholder={
          this.props.columnDef.editPlaceholder || this.props.columnDef.title
        }
        variant="standard"
        style={{ float: "right" }}
        type="number"
        value={this.props.value === undefined ? "" : this.props.value}
        onChange={(event) => {
          let value = event.target.valueAsNumber;
          if (!value && value !== 0) {
            value = undefined;
          }
          return this.props.onChange(value);
        }}
        inputProps={{
          style: {
            fontSize: 13,
            textAlign: "right",
            "aria-label": this.props.columnDef.title,
          },
        }}
        onKeyDown={this.props.onKeyDown}
        autoFocus={this.props.autoFocus}
      />
    );
  }

  render() {
    let component = "ok";

    if (this.props.columnDef.lookup) {
      component = this.renderLookupField();
    } else if (this.props.columnDef.type === "boolean") {
      component = this.renderBooleanField();
    } else if (this.props.columnDef.type === "date") {
      component = this.renderDateField();
    } else if (this.props.columnDef.type === "time") {
      component = this.renderTimeField();
    } else if (this.props.columnDef.type === "datetime") {
      component = this.renderDateTimeField();
    } else if (this.props.columnDef.type === "currency") {
      component = this.renderCurrencyField();
    } else {
      component = this.renderTextField();
    }

    return component;
  }
}

MTableEditField.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  columnDef: PropTypes.object.isRequired,
  dateTimePickerLocalization: PropTypes.object,
};

export default MTableEditField;
