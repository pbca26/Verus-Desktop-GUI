import React from "react";
import PieChart from "react-minimal-pie-chart";
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  CONFIRMED_BALANCE,
  PRIVATE_BALANCE,
  DARK_CARD,
  RESERVE_BALANCE,
  RECEIVE_COIN,
  CHAIN_INFO,
  SEND,
  TRANSPARENT_BALANCE,
  IMMATURE_DETAILS,
  SEND_COIN,
  API_SUCCESS,
  API_FAILED,
  IMMATURE_BALANCE,
  MINED_TX,
  MINTED_TX,
  IMMATURE_TX,
  STAKE_TX,
  INTEREST_BALANCE,
  REJECTED_CONFIRMATIONS,
  PUBLIC_BALANCE
} from "../../../../../util/constants/componentConstants";
import { VirtualizedTable } from '../../../../../containers/VirtualizedTable/VirtualizedTable'
import { TX_TYPES } from '../../../../../util/txUtils/txRenderUtils'
import { timeConverter } from '../../../../../util/displayUtil/timeUtils'
import { SortDirection } from 'react-virtualized';
import SearchBar from '../../../../../containers/SearchBar/SearchBar'
import InputLabel from '@material-ui/core/InputLabel';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import WalletPaper from '../../../../../containers/WalletPaper/WalletPaper'
import TransactionCard from '../../../../../containers/TransactionCard/TransactionCard'
import { FormControl, Select, MenuItem, Tooltip, Typography } from "@material-ui/core";
import CustomButton from "../../../../../containers/CustomButton/CustomButton";
import HelpIcon from '@material-ui/icons/Help';

export const CoinWalletRender = function() {
  return (
    <div
      className="col-md-8 col-lg-9"
      style={{ padding: 16, width: "80%", overflow: "scroll" }}
    >
      <WalletPaper
        style={{
          marginBottom: 16,
          display: "flex",
          padding: 0,
          border: "none",
          overflowX: "scroll",
        }}
      >
        <WalletPaper
          style={{
            padding: 16,
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <div className="d-flex flex-row justify-content-between">
            <h6 style={{ fontSize: 14, margin: 0, width: "max-content" }}>
              {`Current ${this.props.coin} Balance`}
            </h6>
          </div>
          <div style={{ paddingTop: 5 }}>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <h5
                style={{
                  color: "rgb(0,0,0)",
                  fontSize: 36,
                  fontWeight: "bold",
                }}
              >
                {Number(this.state.spendableBalance.crypto.toFixed(8))}
              </h5>
              <h5
                className="d-lg-flex align-items-lg-end"
                style={{
                  color: "rgb(0,0,0)",
                  fontSize: 16,
                  paddingBottom: 5,
                  paddingLeft: 8,
                  fontWeight: "bold",
                }}
              >
                {this.props.coin}
              </h5>
            </div>
            <div className="d-lg-flex justify-content-lg-start">
              <h1 style={{ margin: 0, fontSize: 16, color: "rgb(0,0,0)" }}>
                {`${
                  this.state.spendableBalance.fiat == null
                    ? "-"
                    : this.state.spendableBalance.fiat
                } ${this.props.fiatCurrency}`}
              </h1>
            </div>
          </div>
        </WalletPaper>
        {this.state.spendableBalance.crypto !=
          this.state.pendingBalance.crypto && (
          <WalletPaper
            style={{
              padding: 16,
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <div className="d-flex flex-row justify-content-between">
              <h6 style={{ fontSize: 14, margin: 0, width: "max-content" }}>
                {`Pending ${this.props.coin} Balance`}
              </h6>
            </div>
            <div style={{ paddingTop: 5 }}>
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <h5
                  style={{
                    color: "rgb(0,0,0)",
                    fontSize: 36,
                    fontWeight: "bold",
                  }}
                >
                  {Number(this.state.pendingBalance.crypto.toFixed(8))}
                </h5>
                <h5
                  className="d-lg-flex align-items-lg-end"
                  style={{
                    color: "rgb(0,0,0)",
                    fontSize: 16,
                    paddingBottom: 5,
                    paddingLeft: 8,
                    fontWeight: "bold",
                  }}
                >
                  {this.props.coin}
                </h5>
              </div>
              <div className="d-lg-flex justify-content-lg-start">
                <h1 style={{ margin: 0, fontSize: 16, color: "rgb(0,0,0)" }}>
                  {`${
                    this.state.pendingBalance.fiat == null
                      ? "-"
                      : this.state.pendingBalance.fiat
                  } ${this.props.fiatCurrency}`}
                </h1>
              </div>
            </div>
          </WalletPaper>
        )}
        <WalletPaper
          style={{
            padding: 16,
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <div className="d-flex flex-row justify-content-between">
            <h6 style={{ fontSize: 14, margin: 0, width: "max-content" }}>
              Blockchain Status
            </h6>
            <button
              className="btn btn-primary border rounded"
              type="button"
              name={CHAIN_INFO}
              onClick={(e) => this.openModal(e, null)}
              style={{
                fontSize: 14,
                backgroundColor: "rgba(0,178,26,0)",
                borderWidth: 0,
                color: "rgb(133,135,150)",
                borderColor: "rgb(133, 135, 150)",
                fontWeight: "bold",
              }}
            >
              {"Chain Info"}
            </button>
          </div>
          <div
            className="d-lg-flex"
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            {WalletRenderPie.call(this)}
            <h1
              style={{
                margin: 0,
                fontSize: 16,
                color: "rgb(0,0,0)",
                paddingLeft: 23,
                overflow: "-webkit-paged-x",
              }}
            >
              {this.state.walletLoadState.error && (
                <i
                  className="fas fa-exclamation-triangle"
                  style={{
                    marginRight: 6,
                    color: "rgb(236,124,43)",
                    fontSize: 18,
                  }}
                />
              )}
              {this.state.walletLoadState.message}
            </h1>
          </div>
        </WalletPaper>
      </WalletPaper>
      {/*<div style={{ position: "relative" }}>
        {this.state.chevronVisible && (
          <div
            className="d-flex"
            style={{
              zIndex: 1,
              position: "absolute",
              height: "100%",
              width: "10%",
              right: 0,
              marginRight: "-2px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "35%",
                right: 0,
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1))",
              }}
            />
            <div
              className="d-flex d-sm-flex d-lg-flex justify-content-center align-items-center justify-content-sm-center align-items-sm-center justify-content-lg-center align-items-lg-center"
              style={{
                height: "100%",
                width: "65%",
                right: 0,
                backgroundColor: "#ffffff",
                opacity: 1,
              }}
            >
              <i
                className="fas fa-chevron-right"
                style={{ fontSize: 34, paddingRight: 6 }}
              />
            </div>
          </div>
        )}
      </div>*/}
      {/* Change this when currencies get to mainnet */ this.props.coin ===
      "VRSCTEST"
        ? WalletRenderCurrencyFunctions.call(this)
        : null}
      {WalletRenderBalances.call(this)}
      <TransactionCard
        transactions={
          this.props.transactions != null
            ? this.props.transactions.filter((tx) => {
                return (
                  (!this.props.filterGenerateTransactions ||
                    (tx.category !== MINED_TX &&
                      tx.category !== MINTED_TX &&
                      tx.category !== IMMATURE_TX &&
                      tx.category !== STAKE_TX)) &&
                  tx.confirmations !== REJECTED_CONFIRMATIONS
                );
              })
            : []
        }
        coin={this.props.coin}
        multiverseNameMap={this.props.multiverseNameMap}
      />
      {this.props.zOperations && this.props.zOperations.length > 0 && (
        <WalletPaper>
          <h6
            className="card-title"
            style={{ fontSize: 14, margin: 0, width: "max-content" }}
          >
            {"Pending Transaction Log:"}
          </h6>
          {WalletRenderOperations.call(this)}
        </WalletPaper>
      )}
    </div>
  );
};

export const WalletRenderPie = function() {
  const { NO_HEIGHT, state } = this
  const { percentage, error } = state.walletLoadState
  const noHeight = percentage === NO_HEIGHT

  return error ? (
    <div style={{ color: `rgb(78,115,223)` }}>
      <CircularProgress
        variant={"indeterminate"}
        thickness={4.5}
        size={60}
        color="inherit"
      />
    </div>
  ) : (
    <PieChart
      data={[{ value: 1, key: 1, color: `rgb(78,115,223)` }]}
      reveal={noHeight ? 100 : percentage}
      lineWidth={20}
      animate
      labelPosition={0}
      label={() => {
        return noHeight ? "-" : Math.round(percentage) + "%"
      }}
      labelStyle={{
        fontSize: "25px"
      }}
      style={{
        maxHeight: 60,
        maxWidth: 60,
        minWidth: 60,
        maxWidth: 60
      }}
    />
  );
};

export const WalletRenderBalances = function() {
  const filteredBalances = this.state.walletDisplayBalances.filter(
    (balance) => balance.currency === this.props.selectedCurrency
  );

  const walletDisplayBalances =
    filteredBalances.length === 0
      ? [
          {
            currency: this.props.selectedCurrency,
            balanceAddrType: PUBLIC_BALANCE,
            balanceType: CONFIRMED_BALANCE,
            balance:
              this.props.selectedCurrency !== this.props.coin &&
              this.state.walletDisplayBalances.length > 0
                ? 0
                : "-",
            balanceFiat: "-",
          },
        ]
      : filteredBalances;

  return (
    <WalletPaper
      style={{
        marginBottom: 16,
        backgroundColor: "#ffffff",
        paddingLeft: 8,
        paddingRight: 8,
        overflowX: "scroll",
        display: "flex",
      }}
    >
      {walletDisplayBalances.map((balanceObj) => {
        const {
          balanceType,
          balanceAddrType,
          balance,
          balanceFiat,
          sendable,
          receivable,
          currency
        } = balanceObj;

        /*const balanceTag = balanceChain === RESERVE_BALANCE
        ? RESERVE_BALANCE
        : balanceAddrType === PRIVATE_BALANCE
        ? PRIVATE_BALANCE
        : balanceType === CONFIRMED_BALANCE
        ? TRANSPARENT_BALANCE
        : balanceType*/

        const balanceTag =
          balanceAddrType === PRIVATE_BALANCE
            ? PRIVATE_BALANCE
            : balanceType === CONFIRMED_BALANCE
            ? TRANSPARENT_BALANCE
            : balanceType === IMMATURE_BALANCE
            ? IMMATURE_BALANCE
            : balanceType === INTEREST_BALANCE
            ? INTEREST_BALANCE
            : null;

        const isConvertableBalance =
          balanceTag === TRANSPARENT_BALANCE &&
          this.props.currencyConversionGraph[currency] != null &&
          (this.props.currencyConversionGraph[currency].to.length > 0 ||
            this.props.currencyConversionGraph[currency].from.length > 0) &&
          this.state.currencyInfo != null &&
          (this.state.currencyInfo.spendableTo ||
            this.state.currencyInfo.spendableFrom);

        return balanceTag == null ? null : (
          <div
            className="flex-grow-1"
            key={Math.random()}
            style={{
              paddingRight: 8,
              paddingLeft: 8,
              maxWidth: "100%",
              minWidth: 216,
              flex: 1,
            }}
          >
            <div className="col-lg-12" style={{ padding: 0, height: "100%" }}>
              <div className="card border rounded-0" style={{ height: "100%" }}>
                <div
                  className="card-body"
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    className="d-flex flex-row justify-content-between"
                    style={{ paddingBottom: 3 }}
                  >
                    <h6
                      className="text-capitalize"
                      style={{
                        fontSize: 14,
                        margin: 0,
                      }}
                    >
                      <i
                        className={`far ${
                          balanceTag === PRIVATE_BALANCE
                            ? "fa-eye-slash"
                            : "fa-eye"
                        }`}
                        style={{
                          paddingRight: 6,
                          color: "rgb(133, 135, 150)",
                        }}
                      />
                      {balanceTag === INTEREST_BALANCE
                        ? "Unclaimed Interest"
                        : balanceTag + " Balance"}
                    </h6>
                  </div>
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      className="d-lg-flex justify-content-lg-start"
                      style={{ paddingBottom: 3, paddingTop: 3 }}
                    >
                      <h1
                        style={{
                          margin: 0,
                          fontSize: 16,
                          color: "rgb(0, 0, 0)",
                          fontWeight: "bold",
                        }}
                      >
                        {`${balance} ${this.props.selectedCurrency}`}
                      </h1>
                    </div>
                    <div
                      className="d-lg-flex justify-content-lg-start"
                      style={{ paddingBottom: 3, paddingTop: 3 }}
                    >
                      <h1
                        style={{
                          margin: 0,
                          fontSize: 14,
                        }}
                      >
                        {`${balanceFiat} ${this.props.fiatCurrency}`}
                      </h1>
                    </div>
                    <div
                      style={{
                        paddingTop: 6,
                        display: "flex",
                        justifyContent: "space-between",
                        maxWidth: isConvertableBalance ? 200 : 150,
                      }}
                    >
                      <Tooltip
                        title={
                          sendable != null && !sendable
                            ? ""
                            : balanceTag === INTEREST_BALANCE
                            ? "Claim"
                            : "Send"
                        }
                      >
                        <span>
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={(e) =>
                              this.openModal(
                                null,
                                {
                                  balanceTag,
                                  fund: false,
                                  isMessage: false,
                                  currencyInfo: this.state.currencyInfo,
                                },
                                SEND_COIN
                              )
                            }
                            disabled={
                              balance === 0 ||
                              balance === "-" ||
                              !this.props.addresses ||
                              (this.props.selectedCurrency !==
                                this.props.coin &&
                                !this.props.identities)
                            }
                            style={{
                              fontSize: 10,
                              backgroundColor:
                                balanceTag === INTEREST_BALANCE
                                  ? "rgb(78,115,223)"
                                  : "rgb(236,43,43)",
                              borderWidth: 1,
                              borderColor:
                                balanceTag === INTEREST_BALANCE
                                  ? "rgb(78,115,223)"
                                  : "rgb(236,43,43)",
                              fontWeight: "bold",
                              visibility:
                                sendable != null && !sendable
                                  ? "hidden"
                                  : "unset",
                            }}
                          >
                            {balanceTag === INTEREST_BALANCE ? (
                              <ArrowDownward name={SEND_COIN} />
                            ) : (
                              <ArrowUpward name={SEND_COIN} />
                            )}
                          </button>
                        </span>
                      </Tooltip>
                      <Tooltip title={receivable != null && !receivable ? "" : "Receive"}>
                        <span>
                          <button
                            className="btn btn-primary"
                            type="button"
                            name={RECEIVE_COIN}
                            onClick={(e) =>
                              this.openModal(null, { balanceTag }, RECEIVE_COIN)
                            }
                            style={{
                              fontSize: 10,
                              backgroundColor: "rgb(0,178,26)",
                              borderWidth: 1,
                              borderColor: "rgb(0,178,26)",
                              fontWeight: "bold",
                              visibility:
                                receivable != null && !receivable
                                  ? "hidden"
                                  : "unset",
                            }}
                          >
                            <ArrowDownward />
                          </button>
                        </span>
                      </Tooltip>
                      {/*unusable && (
                        <button
                          className="btn btn-primary"
                          type="button"
                          name={ IMMATURE_DETAILS }
                          onClick={ (e) => this.openModal(e, null) }
                          style={{
                            fontSize: 14,
                            backgroundColor: "rgb(98,98,98)",
                            borderWidth: 1,
                            borderColor: "rgb(98,98,98)",
                            paddingRight: 20,
                            paddingLeft: 20,
                            fontWeight: "bold"
                          }}>
                          {"Details"}
                        </button>
                      )*/}
                      {isConvertableBalance && (
                        <Tooltip title="Convert">
                          <span>
                            <button
                              className="btn btn-primary"
                              type="button"
                              name={SEND_COIN}
                              onClick={(e) =>
                                this.openModal(
                                  null,
                                  {
                                    balanceTag,
                                    fund: false,
                                    isMessage: false,
                                    isConversion: true,
                                    currencyInfo: this.state.currencyInfo,
                                    conversionGraph: this.props
                                      .currencyConversionGraph[currency],
                                    calculateCurrencyData: (currency) =>
                                      this.calculateCurrencyData(
                                        this.props,
                                        currency
                                      ),
                                  },
                                  SEND_COIN
                                )
                              }
                              style={{
                                fontSize: 10,
                                backgroundColor: "rgb(78,115,223)",
                                borderWidth: 1,
                                borderColor: "rgb(78,115,223)",
                                fontWeight: "bold",
                              }}
                            >
                              <ShuffleIcon />
                            </button>
                          </span>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </WalletPaper>
  );
};

export const WalletRenderOperations = function() {
  const zOperations = this.props.zOperations
  const zOperationComps = zOperations.map((operation, index) => {
    return {
      status: operation.status,
      id: operation.id,
      time: operation.creation_time,
      opIndex: index,
      message: operation.error ? operation.error.message : '-'
    };
  });
  
  return (
    <div style={{ height: ((50 * zOperations.length) + 50), width: '100%' }}>
      <VirtualizedTable
        rowCount={zOperationComps.length}
        sortBy="time"
        sortDirection={ SortDirection.ASC }
        onRowClick={ ({rowData}) => this.openOpInfo(rowData) }
        rowGetter={({ index }) => zOperationComps[index]}
        columns={[
          {
            width: 125,
            cellDataGetter: ({ rowData }) => {
              return (
                <div style={{ minWidth: "max-content" }}>
                  <h3
                    className="text-uppercase"
                    style={{
                      marginBottom: 0,
                      fontSize: 16,
                      fontWeight: "bold",
                      color:
                        rowData.status === API_SUCCESS
                          ? "rgb(0,178,26)"
                          : rowData.status === API_FAILED
                          ? "rgb(236,43,43)"
                          : "#f8bb86"
                    }}
                  >
                    {rowData.status}
                  </h3>
                </div>
              );
            },
            flexGrow: 1,
            label: 'Status',
            dataKey: 'status',
          },
          {
            width: 150,
            flexGrow: 1,
            label: 'ID',
            dataKey: 'id',
          },
          {
            width: 125,
            cellDataGetter: ({ rowData }) => {
              const time = timeConverter(rowData.time)
              return time ? time : '-'
            },
            flexGrow: 1,
            label: 'Time',
            dataKey: 'time',
          },
          {
            width: 150,
            flexGrow: 1,
            label: 'Message',
            dataKey: 'message',
          },
        ]}
      />
    </div>
  )
}

export const WalletRenderCurrencyFunctions = function() {
  const { whitelists, activatedCoins, coin, selectedCurrency } = this.props
  const whitelist = whitelists[coin] ? whitelists[coin] : []

  return (
    <React.Fragment>
      <WalletPaper
        style={{
          marginBottom: 16,
          padding: 0,
          border: "none",
          display: "flex",
        }}
      >
        <WalletPaper
          style={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <FormControl variant="outlined" style={{ flex: 1 }}>
            <InputLabel>{"Selected Currency"}</InputLabel>
            <Select
              value={
                selectedCurrency == null
                  ? -1
                  : whitelist.findIndex((value) => value === selectedCurrency)
              }
              onChange={(e) =>
                this.setPreferredCurrency(
                  e.target.value == -1 ? coin : whitelist[e.target.value]
                )
              }
              labelWidth={138}
            >
              <MenuItem value={-1}>{coin}</MenuItem>
              {whitelist.map((currency, index) => {
                return <MenuItem value={index}>{currency}</MenuItem>;
              })}
            </Select>
          </FormControl>
          <Tooltip
            title={`Here you can select the ${coin} currency you want to view/send/receive. To add currencies to this list, search for them or discover them on the right.`}
          >
            <HelpIcon color="primary" style={{ marginLeft: 16 }} />
          </Tooltip>
        </WalletPaper>
        <WalletPaper
          style={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <SearchBar
            containerStyle={{ width: "100%" }}
            disabled={this.state.loadingCurrency}
            label={`Search Currencies`}
            placeholder={"e.g. VRSC"}
            variant={"outlined"}
            clearable={true}
            onChange={(e) => this.updateCurrencySearchTerm(e.target.value)}
            onClear={() => {
              this.updateCurrencySearchTerm("");
            }}
            onSubmit={this.onCurrencySearchSubmit}
            value={this.state.currencySearchTerm}
          />
        </WalletPaper>
        <WalletPaper
          style={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <CustomButton
            onClick={this.openMultiverse}
            title={"Discover Currencies"}
            backgroundColor={"white"}
            textColor={"unset"}
            buttonProps={{
              size: "large",
              color: "default",
              variant: "outlined",
              style: { width: "100%", height: "100%" },
            }}
          />
        </WalletPaper>
      </WalletPaper>
      {coin === "VRSCTEST" && (
        <WalletPaper
          style={{
            marginBottom: 16,
            padding: 8,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography style={{ fontWeight: "bold", textAlign: 'center' }}>
            {
              "Warning: All testnet coins/currencies have no value and will disappear whenever VRSCTEST is reset"
            }
          </Typography>
        </WalletPaper>
      )}
    </React.Fragment>
  );
};

export const WalletRenderCurrencyOptions = function() {
  const { whitelists, coin } = this.props
  const whitelist = whitelists[coin] ? whitelists[coin] : []

  return whitelist.map((currencyTicker, index) => {
    return <MenuItem value={index}>{currencyTicker}</MenuItem>
  })
};
