import React from 'react';
import WalletStyles from './wallet.styles'
import { NATIVE, DASHBOARD, ETH, CHAIN_POSTFIX } from '../../../../util/constants/componentConstants'

export const WalletCardRender = function(coinObj) {
  const {
    fiatCurrency,
    fiatPrices,
    balances,
    mainPathArray,
    loggingOut
  } = this.props;

  const isActive = mainPathArray.includes(`${coinObj.id}_${CHAIN_POSTFIX}`);
  const coinFiatRate = fiatPrices[coinObj.id]
    ? fiatPrices[coinObj.id][fiatCurrency]
    : null;
  const coinBalance = balances[coinObj.id]
    ? balances[coinObj.id].native.public.confirmed +
      (balances[coinObj.id].native.private.confirmed
        ? balances[coinObj.id].native.private.confirmed
        : 0)
    : "-";
  const balanceFiat =
    coinFiatRate && coinBalance !== "-"
      ? (coinFiatRate * coinBalance).toFixed(2)
      : "-";

  return (
    <button
      className="unstyled-button"
      onClick={() => this.openCoin(coinObj.id)}
      key={coinObj.id}
      style={WalletStyles.cardClickableContainer}
    >
      <div
        className="d-flex flex-column align-items-end"
        style={WalletStyles.cardContainer}
      >
        <div
          className={`card ${isActive ? "active-card" : "border-on-hover"}`}
          style={WalletStyles.cardInnerContainer}
        >
          <div
            className="card-body d-flex justify-content-between"
            style={WalletStyles.cardBody}
          >
            <div>
              <div
                className="d-flex"
                style={WalletStyles.cardCoinInfoContainer}
              >
                <img
                  src={`assets/images/cryptologo/${
                    coinObj.mode === ETH ? ETH : "btc"
                  }/${coinObj.id.toLowerCase()}.png`}
                  width="25px"
                  height="25px"
                />
                <h4 style={WalletStyles.cardCoinName}>
                  <strong>{coinObj.name}</strong>
                </h4>
              </div>
              <h5
                className={`text-left coin-type ${
                  coinObj.mode === NATIVE ? "native" : "lite"
                }`}
                style={WalletStyles.cardCoinType}
              >
                <strong>{coinObj.mode === NATIVE ? "NATIVE" : "LITE"}</strong>
              </h5>
            </div>
            <div style={{ paddingTop: 6 }}>
              <h6 className="text-right" style={WalletStyles.fiatValue}>
                {`${balanceFiat}  ${fiatCurrency}`}
              </h6>
              <h5 className="text-right" style={WalletStyles.balance}>
                {`${
                  isNaN(coinBalance)
                    ? coinBalance
                    : Number(coinBalance.toFixed(8))
                } ${coinObj.id}`}
              </h5>
            </div>
          </div>
        </div>
        {isActive && !loggingOut && (
          <a
            className="text-right"
            href="#"
            onClick={() => this.deactivate(coinObj.id, coinObj.mode)}
            style={WalletStyles.deactivateCoin}
          >
            {"Deactivate"}
          </a>
        )}
      </div>
    </button>
  );
};

export const WalletTabsRender = function() {
  return [
    <li className="nav-item" role="presentation" key="wallet-dashboard">
      <a
        className={`nav-link ${this.props.mainPathArray.includes(
          DASHBOARD ? "active" : ""
        )}`}
        href="#"
        onClick={() => this.openDashboard()}
        style={WalletStyles.secondaryTabBarLink}
      >
        <i className="fas fa-home" style={WalletStyles.navigationTabIcon} />
        {"Dashboard"}
      </a>
    </li>,
    <li className="nav-item" role="presentation" key="wallet-addcoin">
      <a
        className="nav-link"
        href={"#"}
        style={WalletStyles.secondaryTabBarLink}
        onClick={this.openAddCoinModal}
      >
        <i className="fas fa-plus" style={WalletStyles.navigationTabIcon} />
        {"Add Coin"}
      </a>
    </li>
  ];
};