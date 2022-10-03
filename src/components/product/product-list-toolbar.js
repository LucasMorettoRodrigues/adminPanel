import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { Search as SearchIcon } from "../../icons/search";

export const ProductListToolbar = (props) => (
  <Box {...props}>
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        m: -1,
      }}
    >
      <Typography sx={{ m: 1 }} variant="h4">
        Produtos
      </Typography>
      <Box sx={{ m: 1 }}>
        <NextLink href="/products/addProduct" passHref>
          <Button color="primary" variant="contained">
            Adicionar Produto
          </Button>
        </NextLink>
      </Box>
    </Box>
    <Box sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{ maxWidth: 500 }}>
            <TextField
              fullWidth
              onChange={props.handleOnChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SvgIcon fontSize="small" color="action">
                      <SearchIcon />
                    </SvgIcon>
                  </InputAdornment>
                ),
              }}
              placeholder="Buscar Produto"
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  </Box>
);
