import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { EventHandler, useEffect, useState } from "react";
import round from "lodash/round";
import isNumber from "lodash/isNumber";
import { getPrices } from "../apis/prices.api";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import InfoIcon from "@mui/icons-material/Info";
import { getHumanReadableDate } from "../utils/helper";
import { PriceData } from "../types/prices.types";

export const ConvertMoney = () => {
  const [prices, setPrices] = useState([] as PriceData[]);

  useEffect(() => {
    getPrices().then((res) => setPrices(res));
  }, []);

  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState({} as PriceData);
  const [toCurrency, setToCurrency] = useState({} as PriceData);
  const [convertedAmount, setConvertedAmount] = useState(null as null | number);

  function convertCurrency() {
    if (!amount || !fromCurrency || !toCurrency) {
      return;
    }
    const priceInUsd = Number(amount) * Number(fromCurrency.price);
    const amountAfterConversion = priceInUsd / Number(toCurrency.price);
    setConvertedAmount(amountAfterConversion);
  }

  function swapCurrencies() {
    const temp = fromCurrency;
    const temp2 = toCurrency;
    resetConvertedAmount();
    setFromCurrency(temp2);
    setToCurrency(temp);
  }

  function handeFromCurrencyChange(e: any) {
    setFromCurrency(e.target.value);
    setConvertedAmount(null);
  }

  function handeToCurrencyChange(e: any) {
    setToCurrency(e.target.value);
    resetConvertedAmount();
  }

  function resetConvertedAmount() {
    setConvertedAmount(null);
  }

  function handleSetAmount(e: React.ChangeEvent<HTMLInputElement>) {
    setAmount(e.target.value);
    resetConvertedAmount();
  }

  const showSummary = isNumber(convertedAmount);
  const moreInformation = (
    <Stack gap={1} p={2}>
      <div>
        {fromCurrency.currency} price updated at:{" "}
        {getHumanReadableDate(fromCurrency.date)}
      </div>
      <div>
        {toCurrency.currency} price updated at:{" "}
        {getHumanReadableDate(toCurrency.date)}
      </div>
      <div>The converted amount is round off to 4 digits.</div>
    </Stack>
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      mt={12}
      ml={12}
      mr={12}
      p={14}
      bgcolor="#f4f4f4"
      borderRadius={10}
      boxShadow={3}
    >
      <Stack
        spacing={{ xs: 2, sm: 4 }}
        direction="row"
        alignItems="center"
        justifyContent="center"
        mb={4}
      >
        <Box>
          <FormControl variant="outlined" sx={{ minWidth: 180 }}>
            <InputLabel>Amount</InputLabel>
            <OutlinedInput
              id="amount"
              type="number"
              value={amount}
              onChange={handleSetAmount}
              endAdornment={
                <InputAdornment position="start">
                  {fromCurrency.img && (
                    <img src={fromCurrency.img} alt="" height="20" width="20" />
                  )}
                </InputAdornment>
              }
              label="Amount"
            />
          </FormControl>
        </Box>
        <Box>
          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel id="from-label">From</InputLabel>
            <Select
              id="from"
              value={fromCurrency}
              onChange={handeFromCurrencyChange}
              label="From"
            >
              {prices.map((info) => (
                <MenuItem key={info.currency} value={info}>
                  <Stack direction="row" alignItems="center">
                    <img src={info.img} alt="" height="20" width="20" />
                    <Typography ml={1}>{info.currency}</Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box>
          <IconButton onClick={swapCurrencies} size="large">
            <SwapHorizIcon />
          </IconButton>
        </Box>
        <Box>
          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel id="to-label">To</InputLabel>
            <Select
              labelId="to-label"
              id="to"
              value={toCurrency}
              onChange={handeToCurrencyChange}
              label="To"
            >
              {prices.map((info) => (
                <MenuItem key={info.currency} value={info}>
                  <Stack direction="row" alignItems="center">
                    <img src={info.img} alt="" height="20" width="20" />
                    <Typography ml={1}>{info.currency}</Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Stack>
      <Stack
        spacing={{ xs: 2, sm: 4 }}
        direction="row"
        alignItems="center"
        justifyContent="space-around"
        width="100%"
      >
        {showSummary ? (
          <Box>
            <Typography>{`${amount} ${fromCurrency.currency} =`}</Typography>

            <Stack direction={"row"} gap={1} alignItems={"center"}>
              <Typography variant="h5">
                {`${round(convertedAmount, 4)} ${toCurrency.currency}`}
              </Typography>
              <Tooltip title={moreInformation}>
                <InfoIcon style={{ marginLeft: "0.5rem", cursor: "pointer" }} />
              </Tooltip>
            </Stack>
          </Box>
        ) : (
          <Box></Box>
        )}

        <Button variant="contained" onClick={convertCurrency}>
          Convert
        </Button>
      </Stack>
    </Box>
  );
};
