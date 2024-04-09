import {
  Box,
  Button,
  CircularProgress,
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

  const selectItems = Object.keys(prices).map((currency) => (
    <MenuItem key={currency} value={currency}>
      <Stack direction="row" alignItems="center">
        <img src={prices[currency]?.img} alt="" height="20" width="20" />
        <Typography ml={1}>{currency}</Typography>
      </Stack>
    </MenuItem>
  ));

  const tooltipInformation = (
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
              direction={{ sm: "column", md: "row" }}
              spacing={{ xs: 1, sm: 2, md: 4 }}
              alignItems="center"
              justifyContent="center"
              mb={4}
            >
              <Box>
                <FormControl variant="outlined" sx={{ minWidth: 220 }}>
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
                    {selectItems}
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <FormControl sx={{ minWidth: 40 }}>
                  <IconButton onClick={swapCurrencies}>
                    <SwapHorizIcon />
                  </IconButton>
                </FormControl>
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
                    {selectItems}
                  </Select>
                </FormControl>
              </Box>
            </Stack>
            <Stack
              direction={{ sm: "column", md: "row" }}
              spacing={{ xs: 1, sm: 2, md: 4 }}
              alignItems="center"
              justifyContent="flex-end"
            >
              <Box
                minWidth={340}
                style={{
                  visibility: showSummary ? "visible" : "hidden",
                }}
              >
                <Typography>{`${amount} ${fromCurrency} =`}</Typography>
                <Stack
                  direction={{ sm: "column", md: "row" }}
                  alignItems="center"
                >
                  <Typography variant="h5" display="block">
                    {`${convertedAmount} ${toCurrency}`}
                  </Typography>

                  <Tooltip title={tooltipInformation}>
                    <InfoIcon
                      style={{ marginLeft: "0.5rem", cursor: "pointer" }}
                    />
                  </Tooltip>
                </Stack>
                <Typography variant="overline" display="block">
                  1 {fromCurrency} = {`${prices[fromCurrency]?.price} USD`}
                </Typography>
                <Typography variant="overline" display="block">
                  1 {toCurrency} = {`${prices[toCurrency]?.price} USD`}
                </Typography>
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
