import React from "react";
import {
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Typography,
  Grid,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

const Ticker = ({ data, handleRemoveSearchItem }) => {
  // console.log(data);
  return (
    <>
      <Grid container spacing={1} style={{ margin: "1px" }}>
        {data.map((item, index) => {
          return (
            <Grid item xs="auto" style={{ textAlign: "center" }} key={index}>
              <Card variant="outlined" style={{ minWidth: "320px" }}>
                <CardHeader
                  avatar={
                    <Avatar src={item.imgscr} sx={{ width: 56, height: 56 }} />
                  }
                  title={<Typography variant="h4">{item.name}</Typography>}
                />
                <CardContent>
                  <Typography variant="h6">24H: {item.high}</Typography>
                  <Typography variant="h3">{item.price}</Typography>
                  <Typography variant="h6">24L: {item.low}</Typography>
                </CardContent>
                <Divider />
                <BottomNavigation showLabels>
                  <BottomNavigationAction
                    label="Remove"
                    icon={<Delete />}
                    onClick={() => handleRemoveSearchItem(item.name)}
                  />
                </BottomNavigation>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default Ticker;
