import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { CustomState, useCustomState } from '../utils';

import './SelectBtn.css'

interface selectBtnProps {
    selectOptionBtn: CustomState<string>
}

export default function SelectAutoWidth({ selectOptionBtn }: selectBtnProps) {
    const [selection, setSelection] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        selectOptionBtn.set(event.target.value);
        // setSelection();
    };

    return (
        <div className='selectBtnMain'>
            <FormControl sx={{ m: 1, minWidth: '10%' }}>
                <InputLabel id="demo-simple-select-autowidth-label">Category</InputLabel>
                <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={selectOptionBtn.get()}
                    onChange={handleChange}
                    autoWidth
                    label="Selection"
                >
                    <MenuItem value={"Created"}>Created</MenuItem>
                    <MenuItem value={"Studied"}>Studied</MenuItem>
                    <MenuItem value={"Recent"}>Recent</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}