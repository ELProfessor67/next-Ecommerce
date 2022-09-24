import FullLayout from '../../src/layouts/FullLayout';
import {ThemeProvider} from '@mui/material/styles';
import theme from '../../src/theme/theme';
import Product from '../../models/product';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import BaseCard from "../../src/components/baseCard/BaseCard";
const {connect,connections} = require('mongoose');

const allproduct = ({products}) => {
    return (
        <ThemeProvider theme={theme}>
          <FullLayout>
             <BaseCard title="Product Perfomance">
                  <Table
                    aria-label="simple table"
                    sx={{
                      mt: 3,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Typography color="textSecondary" variant="h6">
                            Title
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography color="textSecondary" variant="h6">
                            Slug
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography color="textSecondary" variant="h6">
                            Size/Color
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography color="textSecondary" variant="h6">
                            Image
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography color="textSecondary" variant="h6">
                            Price
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.slug}>
                          <TableCell>
                            <Typography
                              sx={{
                                fontSize: "15px",
                                fontWeight: "500",
                              }}
                            >
                              {product.title}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: "600",
                                  }}
                                >
                                  {product.slug}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="h6">
                              ({product.size}/{product.color})
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <img src={product.img} alt="product image" width={50}/>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="h6">${product.price}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </BaseCard>
          </FullLayout>
        </ThemeProvider>
      );
}

export default allproduct

export async function getServerSideProps(context){
    if(!(connections[0].readyState)){
        await connect(process.env.MONGO_URL);
        console.log('connect succesfully')
    }
    const products = await Product.find();
    return({
        props : {products : JSON.parse(JSON.stringify(products))}
    });
}