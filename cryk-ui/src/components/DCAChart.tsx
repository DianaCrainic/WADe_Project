import TextField from "@mui/material/TextField";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React, { useEffect, useState } from "react";
import { Area, AreaChart, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { PriceData } from "../models/PriceData";
import Calculation from "./Calculation";
import "./css/DCAChart.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

const DEFAULT_AMOUNT_TO_INVEST_VALUE = 5;

type DCACalculations = {
    endTotal: number,
    totalCoinAmount: number,
    totalInvested: number,
    totalGained: number,
    totalPercentGained: number,
};

const getTotalCalculations = (priceHistory: PriceData[], amountToInvest: number, startDate: Dayjs | null, endDate: Dayjs | null): DCACalculations => {
    let numberOfDays = 0;
    let cryptocurrencyAmount = 0;
    for (let i = 0; i < priceHistory.length; ++i) {
        const timestamp = priceHistory[i].timestamp;
        if ((startDate == null || startDate.unix() * 1000 <= timestamp) && (endDate == null || endDate.unix() * 1000 >= timestamp)) {
            const cryptocurrencyPrice = priceHistory[i].value;
            cryptocurrencyAmount += amountToInvest / cryptocurrencyPrice;
            ++numberOfDays;
        }
    }

    const totalCoinAmount = cryptocurrencyAmount;
    const totalInvested = amountToInvest * numberOfDays;
    const endTotal = numberOfDays > 0 ? totalCoinAmount * priceHistory[numberOfDays - 1].value : 0;
    const totalGained = endTotal - totalInvested;
    const totalPercentGained = ((endTotal - totalInvested) / totalInvested) * 100;

    return {
        endTotal,
        totalCoinAmount,
        totalInvested,
        totalGained,
        totalPercentGained,
    };
};

const getDailyCalculations = (priceHistory: PriceData[], amountToInvest: number, startDate: Dayjs | null, endDate: Dayjs | null): any[] => {
    let dailyCalculations = [];
    let cryptocurrencyAmount = 0;
    let totalInvested = 0;

    for (let i = 0; i < priceHistory.length; ++i) {
        const timestamp = priceHistory[i].timestamp;
        if ((startDate == null || startDate.unix() * 1000 <= timestamp) && (endDate == null || endDate.unix() * 1000 >= timestamp)) {
            const cryptocurrencyPrice = priceHistory[i].value;
            cryptocurrencyAmount += amountToInvest / cryptocurrencyPrice;
            totalInvested += amountToInvest;
            const total = (cryptocurrencyAmount * cryptocurrencyPrice);
            const date = new Date(timestamp);
            const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

            dailyCalculations.push({
                totalInvested,
                cryptocurrencyAmount,
                cryptocurrencyPrice,
                total,
                date: formattedDate,
            });
        }
    }

    return dailyCalculations;
};

export default function DCAChart(props: { priceHistory: PriceData[], cryptocurrencySymbol: string | undefined }) {
    const [sortedAndFilteredPriceHistory, setSortedAndFilteredPriceHistory] = useState<PriceData[]>([]);
    const [amountToInvest, setAmountToInvest] = useState<number>(DEFAULT_AMOUNT_TO_INVEST_VALUE);
    const [calculations, setCalculations] = useState<DCACalculations>();
    const [dailyCalculations, setDailyCalculations] = useState<any[]>([]);
    const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
    const [endDate, setEndDate] = React.useState<Dayjs | null>(null);

    const [isTotalPortfolioValueAreaDisplayed, setIsTotalPortfolioValueAreaDisplayed] = useState(true);
    const [isAmountOfCryptocurrencyOwnedAreaDisplayed, setIsAmountOfCryptocurrencyOwnedAreaDisplayed] = useState<boolean>(true);
    const [isTotalInvestedAreaDisplayed, setIsTotalInvestedAreaDisplayed] = useState<boolean>(true);
    const [isCryptocurrencyPriceAreaDisplayed, setIsCryptocurrencyPriceAreaDisplayed] = useState<boolean>(true);

    useEffect(() => {
        const sortedPriceHistoryByTimestamp = [...props.priceHistory].sort((pd1, pd2) => pd1.timestamp - pd2.timestamp);
        let filteredPriceHistory: PriceData[] = []; // keep only one price data per day
        let previousTimestamp = null;
        for (let i = 0; i < sortedPriceHistoryByTimestamp.length; ++i) {
            if (
                previousTimestamp == null ||
                (new Date(previousTimestamp).getDay() !== new Date(sortedPriceHistoryByTimestamp[i].timestamp).getDay())
            ) {
                previousTimestamp = sortedPriceHistoryByTimestamp[i].timestamp;
                filteredPriceHistory.push(sortedPriceHistoryByTimestamp[i]);
            }
        }
        setSortedAndFilteredPriceHistory(filteredPriceHistory);
    }, [props.priceHistory]);

    useEffect(() => {
        setCalculations(getTotalCalculations(sortedAndFilteredPriceHistory, amountToInvest, startDate, endDate));
        setDailyCalculations(getDailyCalculations(sortedAndFilteredPriceHistory, amountToInvest, startDate, endDate));
    }, [sortedAndFilteredPriceHistory, amountToInvest, startDate, endDate]);

    const onAmountToInvestChange = (event: any) => {
        const inputValue = event.target.value;
        if (inputValue === "") {
            setAmountToInvest(0);
        } else {
            setAmountToInvest(Number.parseFloat(inputValue));
        }
    };

    const onClickHandlerLegend = (event: any) => {
        if (event.dataKey === "total") {
            setIsTotalPortfolioValueAreaDisplayed(!isTotalPortfolioValueAreaDisplayed);
        }
        else if (event.dataKey === "cryptocurrencyAmount") {
            setIsAmountOfCryptocurrencyOwnedAreaDisplayed(!isAmountOfCryptocurrencyOwnedAreaDisplayed);
        }
        else if (event.dataKey === "totalInvested") {
            setIsTotalInvestedAreaDisplayed(!isTotalInvestedAreaDisplayed);
        }
        else if (event.dataKey === "cryptocurrencyPrice") {
            setIsCryptocurrencyPriceAreaDisplayed(!isCryptocurrencyPriceAreaDisplayed);
        }
    };

    return (
        <div className="dca-chart-container">
            <h2 className="dca-chart-title">DCA Chart</h2>
            <p className="dca-description">Dollar-cost averaging (DCA) is an investment strategy in which the intention is to minimize the impact of volatility when investing or purchasing a large block of a financial asset or instrument. It is also called unit cost averaging, incremental averaging, or cost average effect.</p>
            <div className="dca-chart-filters-container">
                <TextField
                    variant="standard"
                    label="Amount to invest (USD)"
                    type="number"
                    size="medium"
                    defaultValue={DEFAULT_AMOUNT_TO_INVEST_VALUE}
                    InputProps={{ inputProps: { min: 0 } }}
                    onChange={onAmountToInvestChange}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Start date"
                        value={startDate}
                        onChange={(newDate) => {
                            setStartDate(newDate);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        maxDate={endDate ? endDate : dayjs()}
                    />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="End date"
                        value={endDate}
                        onChange={(newDate) => {
                            setEndDate(newDate);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        minDate={startDate ? startDate : dayjs()}
                    />
                </LocalizationProvider>
            </div>
            <div className="calculations-container">
                <Calculation
                    description={"End total (USD)"}
                    value={`$${calculations?.endTotal.toFixed(2)}`}
                />
                <Calculation
                    description={`Amount of ${props.cryptocurrencySymbol} owned`}
                    value={`${calculations?.totalCoinAmount.toFixed(5)}`}
                />
                <Calculation
                    description={"Amount invested (USD)"}
                    value={`$${calculations?.totalInvested.toFixed(2)}`}
                />
                <Calculation
                    description={"Gained (USD)"}
                    value={`${calculations?.totalGained.toFixed(2)}`}
                />
                <Calculation
                    description={"Gained (%)"}
                    value={`${calculations?.totalPercentGained.toFixed(2)}%`}
                />
            </div>
            <div className="chart-container">
                <AreaChart data={dailyCalculations} height={450} width={900}>
                    <XAxis
                        dataKey={"date"}
                        tick={{
                            fill: "white",
                        }}
                    />
                    <YAxis
                        yAxisId="left"
                        orientation={"left"}
                        tick={{
                            fill: "white",
                        }}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{
                            fill: "white",
                        }}
                    />
                    <Tooltip
                        formatter={value => `${(value as number).toFixed(2)}`}
                        contentStyle={{
                            color: "white",
                            backgroundColor: "#121212"
                        }}
                    />
                    <Area
                        type="linear"
                        dataKey="total"
                        name="Total Portfolio Value"
                        stroke="none"
                        fillOpacity={0.8}
                        fill="#f7931a"
                        activeDot={{ strokeWidth: 0 }}
                        yAxisId="left"
                        hide={!isTotalPortfolioValueAreaDisplayed}
                    />
                    <Area
                        type="linear"
                        dataKey="cryptocurrencyAmount"
                        name={`Amount of ${props.cryptocurrencySymbol} owned`}
                        stroke="none"
                        fillOpacity={0.4}
                        fill="#55efc4"
                        activeDot={{ strokeWidth: 0 }}
                        yAxisId="right"
                        hide={!isAmountOfCryptocurrencyOwnedAreaDisplayed}
                    />
                    <Area
                        type="linear"
                        dataKey="totalInvested"
                        name="Total invested"
                        stroke="none"
                        fillOpacity={0.6}
                        fill="#3498db"
                        activeDot={{ strokeWidth: 0 }}
                        yAxisId="left"
                        hide={!isTotalInvestedAreaDisplayed}
                    />
                    <Area
                        type="linear"
                        dataKey="cryptocurrencyPrice"
                        name={`${props.cryptocurrencySymbol} price`}
                        stroke="none"
                        fillOpacity={0.6}
                        fill="#e84393"
                        activeDot={{ strokeWidth: 0 }}
                        yAxisId="left"
                        hide={!isCryptocurrencyPriceAreaDisplayed}
                    />
                    <Legend onClick={onClickHandlerLegend} />
                </AreaChart>
            </div>
        </div>
    );
}
