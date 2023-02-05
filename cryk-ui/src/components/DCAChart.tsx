import React, { useEffect, useState } from "react";
import { Area, AreaChart, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { PriceData } from "../models/PriceData";
import Calculation from "./Calculation";
import "./css/DCAChart.css";

type DCACalculations = {
    endTotal: number,
    totalCoinAmount: number,
    totalInvested: number,
    totalGained: number,
    totalPercentGained: number,
};

const getTotalCalculations = (priceHistory: PriceData[], amountToInvest: number): DCACalculations => {
    const numberOfDays = priceHistory.length;
    let cryptocurrencyAmount = 0;
    for (let i = 0; i < numberOfDays; ++i) {
        cryptocurrencyAmount += amountToInvest / priceHistory[i].value;
    }

    const totalCoinAmount = cryptocurrencyAmount;
    const totalInvested = amountToInvest * numberOfDays;
    const endTotal = totalCoinAmount * priceHistory[priceHistory.length - 1].value;
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

const getDailyCalculations = (priceHistory: PriceData[], amountToInvest: number): any[] => {
    const numberOfDays = priceHistory.length;
    let dailyCalculations = [];
    let cryptocurrencyAmount = 0;
    let totalInvested = 0;

    for (let i = 0; i < numberOfDays; ++i) {
        const cryptocurrencyPrice = priceHistory[i].value;
        cryptocurrencyAmount += amountToInvest / cryptocurrencyPrice;
        totalInvested += amountToInvest;
        const total = (cryptocurrencyAmount * cryptocurrencyPrice);
        const date = new Date(priceHistory[i].timestamp);
        const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

        dailyCalculations.push({
            totalInvested,
            cryptocurrencyAmount,
            cryptocurrencyPrice,
            total,
            date: formattedDate,
        });
    }

    return dailyCalculations;
};

export default function DCAChart(props: { priceHistory: PriceData[], cryptocurrencySymbol: string | undefined }) {
    const [amountToInvest, setAmountToInvest] = useState<number>(200);
    const [calculations, setCalculations] = useState<DCACalculations>();
    const [dailyCalculations, setDailyCalculations] = useState<any[]>([]);

    const [isTotalPortfolioValueAreaDisplayed, setIsTotalPortfolioValueAreaDisplayed] = useState(true);
    const [isAmountOfCryptocurrencyOwnedAreaDisplayed, setIsAmountOfCryptocurrencyOwnedAreaDisplayed] = useState<boolean>(true);
    const [isTotalInvestedAreaDisplayed, setIsTotalInvestedAreaDisplayed] = useState<boolean>(true);
    const [isCryptocurrencyPriceAreaDisplayed, setIsCryptocurrencyPriceAreaDisplayed] = useState<boolean>(true);

    useEffect(() => {
        const sortedPriceHistoryByTimestamp = [...props.priceHistory].sort((pd1, pd2) => pd1.timestamp - pd2.timestamp);
        setCalculations(getTotalCalculations(sortedPriceHistoryByTimestamp, amountToInvest));
        setDailyCalculations(getDailyCalculations(sortedPriceHistoryByTimestamp, amountToInvest));
    }, [props.priceHistory, amountToInvest]);

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
    }

    return (
        <div className="dca-chart-container">
            <h2 className="dca-chart-title">DCA Chart</h2>
            <p className="dca-description">Dollar-cost averaging (DCA) is an investment strategy in which the intention is to minimize the impact of volatility when investing or purchasing a large block of a financial asset or instrument. It is also called unit cost averaging, incremental averaging, or cost average effect.</p>
            <div className="calculations-container">
                <Calculation
                    description={`End total (USD)`}
                    value={`$${calculations?.endTotal.toFixed(2)}`}
                />
                <Calculation
                    description={`Amount of ${props.cryptocurrencySymbol} owned`}
                    value={`${calculations?.totalCoinAmount.toFixed(5)}`}
                />
                <Calculation
                    description={`Amount invested (USD)`}
                    value={`$${calculations?.totalInvested.toFixed(2)}`}
                />
                <Calculation
                    description={`Gained (USD)`}
                    value={`$${calculations?.totalGained.toFixed(2)}`}
                />
                <Calculation
                    description={`Gained (%)`}
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
