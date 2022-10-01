import { useState } from "react";
import PropTypes from "prop-types";
import { XCircle } from "../../icons/x-circle";
import { Card, Grid, IconButton, List, ListItem, ListItemText } from "@mui/material";

export const CategoryListResults = ({ categories, deleteCategory, ...rest }) => {
  const [dense, setDense] = useState(false);

  return (
    <Card {...rest}>
      <Grid item xs={12} md={6}>
        <List dense={dense}>
          {categories.map((item) => (
            <ListItem
              key={item.id}
              secondaryAction={
                <IconButton onClick={() => deleteCategory(item.id)} edge="end" aria-label="delete">
                  <XCircle />
                </IconButton>
              }
            >
              <ListItemText primary={item.category} />
            </ListItem>
          ))}
        </List>
      </Grid>
    </Card>
  );
};

CategoryListResults.propTypes = {
  categories: PropTypes.array.isRequired,
};
