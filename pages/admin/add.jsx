import FullLayout from '../../src/layouts/FullLayout';
import {ThemeProvider} from '@mui/material/styles';
import theme from '../../src/theme/theme';
import {useState} from 'react';
import {toast} from 'react-toastify';

import {
  Grid,
  Stack,
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  FormControl,
  Button,
} from "@mui/material";
import BaseCard from "../../src/components/baseCard/BaseCard";


const add = () => {
    const [form,setForm] = useState({});
    const handlechange = (e) => {
      setForm({
        ...form,
        [e.target.name] : e.target.value
      });
    }

    const formSubmit = async (e) => {
      e.preventDefault();
      // console.log(data)
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/addProduct`,{
        method : "POST",
        headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([form])
      });

      const response = await res.json();
      console.log(response)
      if(response.success){
        toast.success(response.message, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setForm({});
      }else{
        toast.success(response.message, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }


    }


    return (
    <ThemeProvider theme={theme}>
    <FullLayout>
    <Grid container spacing={0}>
      <Grid item xs={12} lg={12}>
        <BaseCard title="Add a Product">
          <Stack spacing={3}>
            <TextField onChange={handlechange} value={form.title ? form.title : ''} id="title" label="Title" name='title' variant="outlined"/>
{/*            <TextField onChange={handlechange} value={form.type ? form.type : ''} id="type" label="Type" name="type" variant="outlined" />*/}
            <TextField onChange={handlechange} value={form.size ? form.size : ''} id="size" label="Size" name="size" variant="outlined" />
            <TextField onChange={handlechange} value={form.color ? form.color : ''} id="color" label="Color" name="color" variant="outlined" />
            <TextField onChange={handlechange} value={form.slug ? form.slug : ''} id="slug" label="Slug" name="slug" variant="outlined" />
            <TextField onChange={handlechange} value={form.category ? form.category : ''} id="category" label="Category" name="category" variant="outlined" />
            <TextField onChange={handlechange} value={form.img ? form.img : ''} id="img" label="Image" name="img" variant="outlined" />
            <TextField onChange={handlechange} value={form.price ? form.price : ''} id="price" label="Price" name="price" variant="outlined" />
            <TextField onChange={handlechange} value={form.available ? form.available : ''} id="available" label="Quantity" name="available" variant="outlined" />
            <TextField onChange={handlechange} value={form.desc ? form.desc : ''} id="desc" label="Description" name="desc" variant="outlined" rows={4} multiline/>
          
          </Stack>
          <br />
          <Button variant="outlined" smt={2} onClick={formSubmit}>
            Submit
          </Button>
        </BaseCard>
      </Grid>
    </Grid>
    </FullLayout>
  </ThemeProvider>
  );
}

export default add