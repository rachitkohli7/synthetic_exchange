[![CircleCI](https://circleci.com/gh/Synthetixio/synthetix-exchange.svg?style=svg&circle-token=fd3dc3a4369c1e281e05262f695d59f94cf5340f)](https://circleci.com/gh/Synthetixio/synthetix-exchange) [![Netlify Status](https://api.netlify.com/api/v1/badges/36a95f47-4d7c-4fd2-be00-fc28fa5822e9/deploy-status)](https://app.netlify.com/sites/synthetix/deploys) [![Discord](https://img.shields.io/discord/413890591840272394.svg?color=768AD4&label=discord&logo=https%3A%2F%2Fdiscordapp.com%2Fassets%2F8c9701b98ad4372b58f13fd9f65f966e.svg)](https://discordapp.com/channels/413890591840272394/)
[![Twitter Follow](https://img.shields.io/twitter/follow/synthetix_io.svg?label=synthetix_io&style=social)](https://twitter.com/synthetix_io)

# Synthetix.Exchange

The code for the [Synthetix.Exchange](https://synthetix.exchange) dApp.<br />
It is powered by [synthetix-data](https://github.com/Synthetixio/synthetix-data) and [synthetix-js](https://github.com/Synthetixio/synthetix-js).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Runs the tests.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run storybook`

Runs storybook.<br />
Open [http://localhost:6006](http://localhost:6006) to view it in the browser.

Project Document
28th August 2020

OVERVIEW:

UI and functionality enhancement of a pre-existing React-based website Synthetic.exchange to meet the customer needs.

GOALS
- Route to /trade
- Color scheme changes: Buttons, Chart background.
- Modification of existing trading ui component to binance like ui as discussed.
- Removal of '?' which redirects to synthetix site.
- Removal of 'wallet overview' under connect.
- Removal of 'synth balance'.
- Below the Trade box add two lines 1st FEE and 2nd GAS PRICE (GWEI) as already given in synthetix.
- Removal of S word everywhere you find in trading pair (we will give you the list of trading pair which you need to replace with current trading pairs (40 pairs) available on left side top when you click sBTC/sUSD + we will give you the price.

SPECIFICATIONS
The project was based on the following frameworks:
React, based on typescript and javascript.
Redux-Saga for global state handling.

MILESTONES

Route to ‘/’
To accomplish this. The route value of the trade page was changed to ‘/’. And the route value of home was changed to ‘/home’ from ‘/’. Also, the links to other pages were removed from the AppHeader(src\pages\Root\components\AppHeader\AppHeader.tsx). #
For the mobile version, the code containing the drop down with links to other pages was removed in the file(src\pages\Root\components\AppHeader\MobileAppHeader\MobileAppHeader.tsx).

Color scheme changes: Buttons, Chart background
The theme of the application is kept dark by making the change in the file src\pages\Root\App.tsx, by assigning the dark theme to the theme data. Old code is commented for the reference.
The dark theme/light theme switch button was removed by commenting the ‘ThemeToggle’ component in the file AppHeader(src\pages\Root\components\AppHeader\AppHeader.tsx). #
This requirement is met by making the changes in the following files:
Src\styles\theme\colors.ts
src\styles\theme\dark.ts

Modification of existing trading ui component to binance like ui as discussed
To accomplish this change new trade types are created: Market, Limit and Stop limit.
The trade type is controlled by a TabsView on the header of the Trade panel.
The tabsView code can be found at src\pages\Trade\components\TradeTypeTabs.
All trade type related changes are there in their separate directory. Each directory contains two main components, Header and the Input type.
Header contains the buy/sell label and the reverse button for the market type.
For limit and stop limit type, the header contains two buttons that show Buy and Sell type of transactions.
The Input component, a stateless component, for each type contains the code to get the number of inputs. The change in the inputs update the states in the file src\pages\Trade\components\CreateOrderCard\CreateOrderCard.js.
The state values and setState functions are passed to these Input components through props.
All these changes are made in the directory src\pages\Trade\components.

Removal of '?' which redirects to synthetix site
This is accomplished by commenting the component SupportLink in the file src\pages\Root\components\AppHeader\AppHeader.tsx.

Removal of 'wallet overview' under connect
This task is accomplished by commenting the code containing the Synth balance panel in the file src\pages\Root\components\AppHeader\WalletMenu\WalletMenu.js

Removal of 'synth balance'
This task is accomplished by commenting the code containing the Synth balance panel in the file src\pages\Root\components\AppHeader\WalletMenu\WalletMenu.js.

Removal of S word everywhere you find in trading pair
This change is accomplished by keeping a mapping of CurrencyKeys(with s) mapped to the display name that has no prefix ‘s’. The display name is used wherever the currency key was printed. And the currency key was used wherever the data need to be manipulated.
This requirement is met by making the changes in the following files:
src\components\Currency\CurrencyPair\CurrencyPair.tsx
src\components\Input\NumericInputWithCurrency.tsx
Src\constants\currency.ts
The function buildTradeLink*, src\constants\routes.ts#.
src\pages\Trade\components\ChartCard\PairListPanel\MarketsTable.tsx
src\pages\Trade\components\ChartCard\PairListPanel\SimpleSearch.tsx

(*) - Only this function was affected in the file.
(#)- The old code is commented to revisit.

MORE RESOURCES:
A diff is taken of all the changes made in this project. The diff is stored at the location ‘synthetic_exchnge/docs’.
New directories created: 
src/components/Button/ButtonOutlined.js
src/components/TabsComponent/
src/pages/Trade/components/Common/
src/pages/Trade/components/LimitTrade/
src/pages/Trade/components/MarketTrade/
src/pages/Trade/components/StopLimitTrade/
src/pages/Trade/components/TradeTypeTabs/



