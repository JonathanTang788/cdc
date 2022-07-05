import React, { useEffect, useState, useRef } from "react";
import { imagelist } from "./imagelist";
import {
  Alert, //severity=[error, warning, info, success}
  Snackbar,
  Button,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";

import { Send } from "@mui/icons-material";
import getTicker from "./api/getTicker";
import Ticker from "./components/ticker";
import { Box } from "@mui/system";

const getSearchArrayLocalStorage = () => {
  let list = localStorage.getItem("search");
  console.log("Load Search Data");
  //console.log(list);
  if (list) {
    let sArray = JSON.parse(list);
    //console.log(sArray);
    return sArray;
  } else {
    return [];
  }
};

const App = () => {
  const effRan = useRef(false);
  const [searchArray, setsearchArray] = useState([]);
  const [data, setData] = useState([]);
  const [imgscr, SetImgScr] = useState("cro");
  //snackbar
  const [sbOpen, setSbOpen] = useState(false);
  const [sbMsg, setSbMsg] = useState("");
  const [sbSeverity, setSbSeverity] = useState("info");
  const handleSubmit = async (e) => {
    e.preventDefault();
    let cPair = document.getElementById("cryptoPair").value.toUpperCase();
    const cImg = imgscr;
    console.log("Form Submitted: ", cPair, "/", cImg);

    //Check existing array does not have this pair
    const checkArray = searchArray.find((item) => item.name === cPair);
    if (checkArray) {
      setSbOpen(true);
      setSbSeverity("info");
      setSbMsg("Crypto Pair already streaming");
    } else {
      // Check CDC got this pair or not
      const res = await getData(cPair);
      //console.log(res);
      if (res.name) {
        setsearchArray([...searchArray, { name: cPair, imgscr: cImg }]);
        setSbOpen(true);
        setSbSeverity("success");
        setSbMsg("Added to Alert");
      } else {
        setSbOpen(true);
        setSbSeverity("error");
        setSbMsg("Crypto pair does not exist!");
      }
    }
  };

  const saveSearchArrayLocalStorage = () => {
    console.log("Save array");
    localStorage.setItem("search", JSON.stringify(searchArray));
  };

  const handleRemoveSearchItem = (name) => {
    let newSearchArray = searchArray.filter((item) => item.name !== name);
    setsearchArray(newSearchArray);
    setSbOpen(true);
    setSbSeverity("success");
    setSbMsg(`${name} removed from stream`);
  };

  const getData = async (cryptopair) => {
    const res = await getTicker(cryptopair);
    // console.log(res);
    return {
      name: res.i,
      price: res.a,
      high: res.h,
      low: res.l,
    };
  };

  const handleGetCrypto = async () => {
    let newArr = [];
    for (let i = 0; i < searchArray.length; i++) {
      let nRes = await getData(searchArray[i].name);
      nRes.imgscr = "/cryptoimg/" + searchArray[i].imgscr + ".jpg";
      newArr.push(nRes);
      await new Promise((r) => setTimeout(r, 50));
    }
    setData(newArr);
    console.log("refresh");
  };

  useEffect(() => {
    let timeout;
    if (effRan.current === false) {
      setsearchArray(getSearchArrayLocalStorage());
      console.log("useEffect once", searchArray);
    } else {
      console.log("useEffect - Stream Tickers");
      handleGetCrypto();
      timeout = setInterval(() => {
        handleGetCrypto();
      }, 15000);
      saveSearchArrayLocalStorage();
    }
    return () => {
      effRan.current = true;
      clearInterval(timeout);
    };
  }, [searchArray]);

  return (
    <>
      <Box sx={{ flexGrow: 1 }} style={{ margin: "10px" }}>
        <form onSubmit={handleSubmit}>
          <TextField
            id="cryptoPair"
            label="Crypto Pair"
            variant="outlined"
            required
            sx={{ width: 150 }}
            placeholder="CRO_USDT"
          />
          <Select
            variant="outlined"
            labelId="cryptoimg-label"
            id="cryptoimg"
            displayEmpty
            value={imgscr}
            sx={{ width: 150 }}
            onChange={(e) => SetImgScr(e.target.value)}
          >
            {imagelist.map((img, index) => (
              <MenuItem key={index} value={img}>
                {img}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            endIcon={<Send />}
            style={{
              marginTop: "3px",
              marginLeft: "5px",
              padding: "10px",
              width: "100px",
            }}
            type="submit"
          >
            Add
          </Button>
        </form>
      </Box>
      <Ticker data={data} handleRemoveSearchItem={handleRemoveSearchItem} />
      <Snackbar
        open={sbOpen}
        autoHideDuration={6000}
        onClose={() => {
          setSbOpen(false);
        }}
      >
        <Alert severity={sbSeverity} sx={{ width: "100%", typography: "h4" }}>
          {sbMsg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default App;
