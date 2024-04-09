import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
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
import React, { useEffect, useState } from "react";
import isNumber from "lodash/isNumber";
import { getPrices } from "../apis/prices.api";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import InfoIcon from "@mui/icons-material/Info";
import { getHumanReadableDate } from "../utils/helper";
import { PriceData } from "../types/prices.types";

type Errors = {
  amount?: boolean;
  fromCurrency?: boolean;
  toCurrency?: boolean;
};

export const ConvertMoney = () => {
  const [prices, setPrices] = useState<PriceData>({});

  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    setIsLoading(true);
    getPrices()
      .then((res) => setPrices(res))
      .finally(() => setIsLoading(false));
  }, []);

  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState<keyof PriceData>("");
  const [toCurrency, setToCurrency] = useState<keyof PriceData>("");
  const [convertedAmount, setConvertedAmount] = useState<null | number>(null);

  function convertCurrency() {
    if (validateForm()) {
      return;
    }
    const priceInUsd = Number(amount) * Number(prices[fromCurrency].price);
    const amountAfterConversion = priceInUsd / Number(prices[toCurrency].price);
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

  function validateForm() {
    debugger;
    const errors = {} as Errors;
    switch (true) {
      /* FALLTHROUGH */
      case amount === "":
        errors.amount = !amount;
      case !fromCurrency:
        errors.fromCurrency = !fromCurrency;
      case !toCurrency:
        errors.toCurrency = !toCurrency;
    }

    setErrors(errors);
    return !!Object.keys(errors).length;
  }

  const showSummary = isNumber(convertedAmount);

  const moreInformation = (
    <Stack gap={1} p={2}>
      <div>
        {fromCurrency} price updated at
        <Typography variant="overline" display="block">
          {getHumanReadableDate(prices[fromCurrency]?.date)}
        </Typography>
      </div>
      <div>
        {toCurrency} price updated at
        <Typography variant="overline" display="block">
          {getHumanReadableDate(prices[toCurrency]?.date)}
        </Typography>
      </div>
    </Stack>
  );

  return (
    <>
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
        {isLoading && <CircularProgress />}
        {!isLoading && (
          <>
            <Stack
              spacing={{ xs: 2, sm: 4, md: 4 }}
              alignItems="center"
              justifyContent="center"
              mb={4}
              direction="row"
              useFlexGap
              flexWrap="wrap"
            >
              <Box>
                <FormControl variant="outlined" sx={{ minWidth: 180 }}>
                  <InputLabel>Amount</InputLabel>
                  <OutlinedInput
                    error={errors.amount}
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={handleSetAmount}
                    endAdornment={
                      <InputAdornment position="start">
                        {prices[fromCurrency]?.img && (
                          <img
                            src={prices[fromCurrency].img}
                            alt=""
                            height="20"
                            width="20"
                          />
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
                    error={errors.fromCurrency}
                  >
                    {Object.keys(prices).map((currency) => (
                      <MenuItem key={currency} value={currency}>
                        <Stack direction="row" alignItems="center">
                          <img
                            src={prices[currency]?.img}
                            alt=""
                            height="20"
                            width="20"
                          />
                          <Typography ml={1}>{currency}</Typography>
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
                    error={errors.toCurrency}
                  >
                    {Object.keys(prices).map((currency) => (
                      <MenuItem key={currency} value={currency}>
                        <Stack direction="row" alignItems="center">
                          <img
                            src={prices[currency]?.img}
                            alt=""
                            height="20"
                            width="20"
                          />
                          <Typography ml={1}>{currency}</Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Stack>
            <Stack
              spacing={{ xs: 1, sm: 2 }}
              alignContent="center"
              alignItems="center"
              justifyContent="center"
              direction="row"
            >
              <Box
                width="400px"
                style={{
                  visibility: showSummary ? "visible" : "hidden",
                }}
              >
                <Typography>{`${amount} ${fromCurrency} =`}</Typography>
                <Stack direction={"row"} gap={1} alignItems={"center"}>
                  <Typography variant="h5">
                    {`${convertedAmount} ${toCurrency}`}
                  </Typography>
                  <Tooltip title={moreInformation}>
                    <InfoIcon
                      style={{ marginLeft: "0.5rem", cursor: "pointer" }}
                    />
                  </Tooltip>
                </Stack>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  size="large"
                  onClick={convertCurrency}
                >
                  Convert currency
                </Button>
              </Box>
            </Stack>
          </>
        )}
      </Box>
    </>
  );
};
