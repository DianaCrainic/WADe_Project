import React, { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import CryptoCard from "../components/CryptoCard"
import "./css/Cryptocurrencies.css";
import { gql, useQuery } from "@apollo/client";
import { Cryptocurrency } from "../models/Cryptocurrency";
import { useNavigate } from "react-router-dom";
import { Alert, Button, CircularProgress, Pagination } from "@mui/material";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import CreateCryptocurrencyCardDialog from "../components/CreateCryptocurrencyCardDialog";
import { GetPaginatedCryptocurrenciesInput } from "../models/GetPaginatedCryptocurrenciesInput";
import { RefetchInput } from "../models/RefetchInput";
import { styled, alpha } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import TextField from "@mui/material/TextField";

const GET_PAGINATED_CRYPTOCURRENCIES_QUERY = gql`
    query GetPaginatedCryptocurrencies($limit: Int = 10, $offset: Int = 0, $searchText: [String] = [], $sortOrder: String = "DESC") {
        cryptocurrencies(limit: $limit, offset: $offset, searchText: $searchText, sortOrder: $sortOrder)  
        {
            id
            symbol
            description
            totalCoins
            blockTime
            dateFounded
        }
        cryptocurrenciesInfo(searchText: $searchText) {
            totalCount
        }
    }
`;

const CREATE_CRYPTOCURRENCY = gql`
mutation CreateCryptocurrency($createCryptocurrencyInput: CreateCryptocurrencyInput!) {
    createCryptocurrency(createCryptocurrencyInput: $createCryptocurrencyInput) {
        id
        symbol
        description
        blockReward
        totalCoins
        source
        website
        dateFounded
    }
}
`;

const DELETE_CRYPTOCURRENCY = gql`
mutation RemoveCryptocurrencyById($id: ID!) {
    removeCryptocurrency(id: $id) {
        id
        symbol
    }
}
`;

const CRYPTOS_PER_PAGE = 12;

const getTotalCoinsStats = (cryptocurrencies: Cryptocurrency[]): { name: string, value: number }[] => {
    const mappedCryptocurrencies = cryptocurrencies.map(cryptocurrency => {
        return {
            name: cryptocurrency.symbol,
            value: cryptocurrency.totalCoins ? Number.parseFloat(cryptocurrency.totalCoins) : -1,
        };
    });

    return mappedCryptocurrencies.filter(element => element.value !== -1);
}

const getBlockTimeStats = (cryptocurrencies: Cryptocurrency[]): { name: string, value: number }[] => {
    const mappedCryptocurrencies = cryptocurrencies.map(cryptocurrency => {
        return {
            name: cryptocurrency.symbol,
            value: cryptocurrency.blockTime ? cryptocurrency.blockTime : -1,
        };
    });

    return mappedCryptocurrencies.filter(element => element.value !== -1);
}

const getBarChart = (data: { name: string, value: number }[], name: string): any => {
    return (<ResponsiveContainer width="90%" height={500} >
        <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 40,
                right: 30,
                left: 30,
                bottom: 40,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
                dataKey="name"
                tick={{
                    fill: "white",
                }}
            />
            <YAxis
                tick={{
                    fill: "white",
                }}
            />
            <Tooltip
                contentStyle={{
                    color: "white",
                    backgroundColor: "#121212",
                }}
            />
            <Legend />
            <Bar
                dataKey="value"
                fill="white"
                name={name}
            />
        </BarChart>
    </ResponsiveContainer>);
}

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    textAlign: "left",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.05),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.15),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(1),
        width: "auto",
    }
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    height: "60px",
    fontSize: "1.5rem",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "30ch"
        },
    },
}));

const useStyles = makeStyles((theme: any) => ({
    chip: {
        "&.MuiChip-root": {
            height: theme.spacing(6),
            marginLeft: theme.spacing(1),
        },
        "& .MuiChip-label": {
            fontSize: 25
        },
    }
}));

export default function Cryptocurrencies() {
    const title = "Cryptocurrencies";
    const [currentPage, setCurrentPage] = useState(1);
    const [totalNumberOfPages, setTotalNumberOfPages] = useState(Number);
    const [searchTextValue, setSearchTextValue] = useState<string[]>([]);
    const [sortOrderDateFounded, setSortOrderDateFounded] = useState("DESC");
    const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
    const [endDate, setEndDate] = React.useState<Dayjs | null>(null);

    const navigate = useNavigate();

    const getPaginatedCryptocurrenciesInput: GetPaginatedCryptocurrenciesInput = {
        limit: CRYPTOS_PER_PAGE,
        offset: (currentPage - 1) * CRYPTOS_PER_PAGE,
        searchText: searchTextValue.length !== 0 ? searchTextValue : [""],
        sortOrder: sortOrderDateFounded
    }

    const { data, loading, error } = useQuery(GET_PAGINATED_CRYPTOCURRENCIES_QUERY, {
        variables: getPaginatedCryptocurrenciesInput,
        context: { clientName: "cryptocurrenciesGraphqlEndpoint" }
    });

    const refetchInput: RefetchInput<GetPaginatedCryptocurrenciesInput> = {
        context: "cryptocurrenciesGraphqlEndpoint",
        query: GET_PAGINATED_CRYPTOCURRENCIES_QUERY,
        variables: getPaginatedCryptocurrenciesInput
    }

    const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
    const [totalCoinsStats, setTotalCoinsStats] = useState<{ name: string, value: number }[]>([]);
    const [blockTimeStats, setBlockTimeStats] = useState<{ name: string, value: number }[]>([]);

    const [searchItems, setSearchItems] = useState<string[]>([]);
    const classes = useStyles();
    const [seachInputValue, setSeachInputValue] = useState("");

    const handleKeyDown = (event: any) => {
        if (["Enter", "Tab", ","].includes(event.key)) {
            event.preventDefault();

            let searchItem = seachInputValue?.trim();

            if (searchItem) {
                setSearchItems([...searchItems, searchItem]);
                setSeachInputValue(event.target.value);
                setSearchTextValue([...searchItems, searchItem]);
            }
            setSeachInputValue("");
        }
    };

    const handleDelete = (searchItem: string) => (event: any) => {
        setSearchItems(searchItems.filter((newSearchItem: string) => newSearchItem !== searchItem));
        setSeachInputValue("");
        setSearchTextValue(searchItems.filter((newSearchItem: any) => newSearchItem !== searchItem));
    };

    const handleClear = () => {
        setSearchItems([]);
        setSeachInputValue("");
        setSearchTextValue([]);
    }

    const handleChangeDropdown = (event: any) => {
        setSortOrderDateFounded(event.target.value);
    };

    useEffect(() => {
        if (data) {
            setCryptocurrencies(data.cryptocurrencies);
            setTotalNumberOfPages(Math.ceil(data.cryptocurrenciesInfo.totalCount / CRYPTOS_PER_PAGE));
            setTotalCoinsStats(getTotalCoinsStats(data.cryptocurrencies));
            setBlockTimeStats(getBlockTimeStats(data.cryptocurrencies));
        }
    }, [loading, data]);

    if (loading) {
        return (
            <div className="page-container">
                <CircularProgress color="inherit" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="page-container">
                <Alert severity="error">{error.message}</Alert>
            </div>
        )
    }

    return (
        <HelmetProvider>
            <>
                <Helmet>
                    <title>{title}</title>
                </Helmet>
                <div className="page-container">
                    <div className="title">
                        <h1>Cryptocurrency Knowledge Manager</h1>
                    </div>
                    <div className="buttons-container">
                        <Button
                            className="visualizations-button"
                            variant="outlined"
                            size="large"
                            onClick={() => { navigate(`/cryptos/visualizations`) }}
                        >
                            Visualizations
                        </Button>
                    </div>
                    <div className="filters-component">
                        <div className="search-component">
                            <div className="search-box">
                                <Search>
                                    <SearchIconWrapper>
                                        <SearchIcon />
                                    </SearchIconWrapper>
                                    <StyledInputBase
                                        placeholder="ace,bit..."
                                        inputProps={{ "aria-label": "search" }}
                                        value={seachInputValue}
                                        onChange={event => setSeachInputValue(event.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                </Search>
                            </div>
                            <Chip className="clear-filters-chip" label={"Clear filters"} onClick={() => handleClear()} />
                            <div className="chips-list">
                                {searchItems.map((item: string, index: number) => (
                                    <Chip
                                        label={item}
                                        onDelete={handleDelete(item)}
                                        className={classes.chip}
                                        key={index}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="sorting-component">
                            <FormControl fullWidth variant="filled" sx={{ m: 1, minWidth: 200, }}>
                                <InputLabel style={{ fontSize: "1.1rem" }}>Date Founded</InputLabel>
                                <Select
                                    style={{ fontSize: "1.1rem" }}
                                    value={sortOrderDateFounded}
                                    defaultValue="DESC"
                                    label="Date Founded"
                                    onChange={handleChangeDropdown}
                                >
                                    <MenuItem value={"DESC"}>Newest to Oldest</MenuItem>
                                    <MenuItem value={"ASC"}>Oldest to Newest</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className="date-range-filtering">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    className="start-date-picker"
                                    label="Start date"
                                    value={startDate}
                                    onChange={(newDate) => {
                                        setStartDate(newDate);
                                    }}
                                    renderInput={(params) => <TextField {...params} variant="filled" />}
                                    maxDate={endDate ? endDate : dayjs()}
                                />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    className="end-date-picker"
                                    label="End date"
                                    value={endDate}
                                    onChange={(newDate) => {
                                        setEndDate(newDate);
                                    }}
                                    renderInput={(params) => <TextField {...params} variant="filled" />}
                                    minDate={startDate ? startDate : dayjs()}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>

                    <div className="cards-container">
                        {cryptocurrencies.length === 0 &&
                            <h2 className="no-cryptos">There are no cryptocurrencies matching the filters.</h2>}

                        {cryptocurrencies ?
                            cryptocurrencies.map((cryptocurrency: Cryptocurrency, index: number) => (
                                <CryptoCard cryptocurrency={cryptocurrency}
                                    queryDelete={DELETE_CRYPTOCURRENCY}
                                    refetchInput={refetchInput} key={index} />))
                            : null
                        }
                    </div>

                    <CreateCryptocurrencyCardDialog
                        dialogQuery={CREATE_CRYPTOCURRENCY}
                        refetchInput={refetchInput}
                    />
                    {cryptocurrencies.length !== 0 &&
                        <Pagination className="pagination"
                            count={totalNumberOfPages}
                            color="primary"
                            size="large"
                            page={currentPage}
                            variant="outlined"
                            onChange={(event, value) => setCurrentPage(value)} />}
                    {totalCoinsStats.length > 0 &&
                        <>
                            <h2>Total coins</h2>
                            {getBarChart(totalCoinsStats, "Number of coins")}
                        </>}
                    {blockTimeStats.length > 0 &&
                        <>
                            <h2>Block time</h2>
                            {getBarChart(blockTimeStats, "Block time")}
                        </>}

                </div>
            </>
        </HelmetProvider>
    );
}