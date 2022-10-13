import {
  Box,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  Button,
} from "@mui/material";
import NextLink from "next/link";
import { Search as SearchIcon } from "../../icons/search";

export const CategoryListToolbar = ({ searchCategories, ...props }) => (
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
        Categorias
      </Typography>
      <Box sx={{ m: 1 }}>
        <NextLink href="/categories/addCategory" passHref>
          <Button color="primary" variant="contained">
            Adicionar Categoria
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
              onChange={searchCategories}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SvgIcon color="action" fontSize="small">
                      <SearchIcon />
                    </SvgIcon>
                  </InputAdornment>
                ),
              }}
              placeholder="Buscar Categoria"
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  </Box>
);
