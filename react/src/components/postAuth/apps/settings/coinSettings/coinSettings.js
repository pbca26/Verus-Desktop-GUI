import React from 'react';
import { connect } from 'react-redux';
import { 
  CoinSettingsRender,
} from './coinSettings.render';
import { NATIVE, RUN_SIGN_HASH, ERROR_SNACK } from '../../../../../util/constants/componentConstants';
import { customRpcCall } from '../../../../../util/api/wallet/walletCalls';
import { updateLocalBlacklists, newSnackbar, updateLocalWhitelists } from '../../../../../actions/actionCreators';
import Store from '../../../../../store';

class CoinSettings extends React.Component {
  constructor(props) {
    super(props);
    this.availableModeArr = [NATIVE] /*Object.keys(props.selectedCoinObj.available_modes).filter(mode => {
      return props.selectedCoinObj.available_modes[mode]
    })*/
    //TODO: Uncomment this when you add settings for electrum or eth modes

    this.state = {
      activeTab: 0,
      tabs: this.availableModeArr,
      disableBlacklist: false,
      disableWhitelist: false
    }

    // Any properties here will prevent the command with their key from being run
    // on the console by typing run <key>, and will print our their value instead.
    // E.g., to override help, you could do ['help'] = "No."
    this.COMMAND_OVERRIDES = {};

    this.handleTabChange = this.handleTabChange.bind(this)
    this.setConfigValue = this.setConfigValue.bind(this)
    this.callDaemonCmd = this.callDaemonCmd.bind(this)
    this.removeFromBlacklist = this.removeFromBlacklist.bind(this)
    this.removeFromWhitelist = this.removeFromWhitelist.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedCoinObj != this.props.selectedCoinObj) {      
      //TODO: Uncomment this when you add settings for electrum or eth modes
      /*this.availableModeArr = Object.keys(nextProps.selectedCoinObj.available_modes).filter(mode => {
        return nextProps.selectedCoinObj.available_modes[mode]
      })*/

      this.setState({ activeTab: 0, tabs: this.availableModeArr })
    }
  }

  removeFromBlacklist(value) {
    this.setState({ disableBlacklist: true }, async () => {
      const {
        blacklist,
        selectedCoinObj,
        dispatch
      } = this.props;
      let currentBlacklist = [...blacklist]
      const allBlacklists = Store.getState().localCurrencyLists.blacklists
  
      const index = currentBlacklist.indexOf(value);
      if (index > -1) {
        currentBlacklist.splice(index, 1);
      }
  
      try {
        dispatch(await updateLocalBlacklists({ ...allBlacklists, [selectedCoinObj.id]: currentBlacklist}))
        this.setState({ disableBlacklist: false })
      } catch(e) {
        dispatch(newSnackbar(ERROR_SNACK, e.message))
        this.setState({ disableBlacklist: false })
      }
    })
  }

  removeFromWhitelist(value) {
    this.setState({ disableWhitelist: true }, async () => {
      const {
        whitelist,
        selectedCoinObj,
        dispatch
      } = this.props;
      let currentWhitelist = [...whitelist]
      const allWhitelists = Store.getState().localCurrencyLists.whitelists
  
      const index = currentWhitelist.indexOf(value);
      if (index > -1) {
        currentWhitelist.splice(index, 1);
      }
  
      try {
        dispatch(await updateLocalWhitelists({ ...allWhitelists, [selectedCoinObj.id]: currentWhitelist}))
        this.setState({ disableWhitelist: false })
      } catch(e) {
        dispatch(newSnackbar(ERROR_SNACK, e.message))
        this.setState({ disableWhitelist: false })
      }
    })
  }

  callDaemonCmd(args, print) {    
    // Filter out blank arguments
    const argsFiltered = args._.filter(arg => {
      return arg.toString().length > 0
    })   

    const cliCmd = argsFiltered.length ? argsFiltered[0] : 'help'
    let cliParams = argsFiltered.length ? argsFiltered.slice(1, argsFiltered.length) : []
    let cliCmdsParsed = []
    let skipIndexes = []

    // Try to parse json strings, turn boolean strings into booleans, and number strings into numbers
    cliParams = cliParams.map(param => {
      if (param === "true") return true
      if (param === "false") return false
      if (!isNaN(Number(param))) return Number(param)

      return param
    })

    // Make arguments with space surrounded by quotes one argument
    cliParams.forEach((cmdParam, index) => {
      if (!skipIndexes.includes(index)) {
        let parsedParam = cmdParam

        if (typeof cmdParam === 'string' && (cmdParam[0] == "'" || cmdParam[0] == '"')) {
          parsedParam = ""
          let stepIndex = index
          let endChar = cmdParam[0]
          let stepCmd = cliParams[stepIndex]
          let finishedParse = false
  
          while (!finishedParse && typeof stepCmd === 'string' && stepIndex < cliParams.length) {
            stepCmd = cliParams[stepIndex]
            parsedParam += stepIndex == index ? stepCmd : ' ' + stepCmd
            skipIndexes.push(stepIndex)
            
            if (stepCmd[stepCmd.length - 1] === endChar) {
              finishedParse = true
            }
  
            stepIndex++
          }   
          
          parsedParam = parsedParam.replace(endChar === "'" ? /'/g : /"/g, '')

          try {
            const parsedJson = JSON.parse(parsedParam)

            if (typeof parsedJson === 'number') cliCmdsParsed.push(parsedJson.toString())
            else cliCmdsParsed.push(parsedJson)
          } catch(e) {
            cliCmdsParsed.push(parsedParam)
          }
        } else {
          cliCmdsParsed.push(parsedParam)
        }
      } 
    })

    if (this.COMMAND_OVERRIDES[cliCmd] != null) {
      print(this.COMMAND_OVERRIDES[cliCmd])
    } else {
      // Make RPC call based on params given
      customRpcCall(this.props.selectedCoinObj.id, cliCmd, cliCmdsParsed)
      .then(response => {
        if (response) {
          const { result } = response

          if (result == null) {
            print("No response.")
          } else if (typeof result == 'string') {
            // Format output string in readable format
            print(`${result
              .replace(/{/g, `{`)
              .replace(/\\"/g, `"`)
              .replace(/\\n/g, `\n`)
              .replace(/}/g, `}`)}`)
          } else if (typeof result == 'object') {
            // Format JSON in readable format
            print(JSON.stringify(result)
              .replace(/,/g, ',\n') 
              .replace(/":/g, '": ')
              .replace(/{/g, '{\n')
              .replace(/}/g, '\n}'))
          } else if (typeof result == 'boolean') {
            print(result ? "true" : "false")
          } else {
            print(result)
          }
        }
      })
      .catch(e => {
        print(e.message)
      })
    }
  }

  setConfigValue(name, value) {
    const { props, state } = this
    const { displayConfig, setDisplayConfig, selectedCoinObj } = props
    const { activeTab, tabs } = state

    setDisplayConfig({
      ...displayConfig,
      coin: {
        ...displayConfig.coin,
        [tabs[activeTab]]: {
          ...displayConfig.coin[tabs[activeTab]],
          [name]: {
            ...displayConfig.coin[tabs[activeTab]][name],
            [selectedCoinObj.id]: value
          }
        }
      }
    });
  }

  handleTabChange(event, newTab) {
    this.setState({ activeTab: newTab });
  };

  render() {
    return CoinSettingsRender.call(this);
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    mainPath: state.navigation.mainPath,
    configSchema: state.settings.configSchema.coin,
    blacklist: state.localCurrencyLists.blacklists[ownProps.selectedCoinObj.id] || [],
    whitelist: state.localCurrencyLists.whitelists[ownProps.selectedCoinObj.id] || [],
  };
};

export default connect(mapStateToProps)(CoinSettings);