import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from "react";
import TextField from "@mui/material/TextField";

function DatePickerComponent(props) {
    let { value, setValue, label } = props;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker value={value} onChange={setValue}
                            renderInput={(inputProps) => {
                                return (
                                    <TextField
                                        {...inputProps}
                                        color="primary"
                                        label={label}
                                        InputLabelProps={{shrink: true}}
                                    />
                                );
                            }}
                />
        </LocalizationProvider>
    );
}

export default DatePickerComponent