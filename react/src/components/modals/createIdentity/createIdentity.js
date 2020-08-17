import React from 'react';
import { connect } from 'react-redux';
import { 
  CreateIdentityRender
} from './createIdentity.render';
import {
  CREATE_IDENTITY,
  ENTER_DATA,
  API_SUCCESS,
  ERROR_SNACK,
  API_ERROR,
  SUCCESS_SNACK,
  CONFIRM_DATA,
  API_GET_TRANSACTIONS,
  API_GET_BALANCES,
  API_GET_ZOPERATIONSTATUSES,
  Z_SEND,
  INFO_SNACK,
  API_GET_NAME_COMMITMENTS,
  API_GET_IDENTITIES,
  MID_LENGTH_ALERT,
  NATIVE,
  API_REGISTER_ID_NAME,
  API_RECOVER_ID,
  API_REGISTER_ID
} from "../../../util/constants/componentConstants";
import { registerIdName, registerId, recoverId } from '../../../util/api/wallet/walletCalls';
import { newSnackbar, expireData } from '../../../actions/actionCreators';
import { conditionallyUpdateWallet } from '../../../actions/actionDispatchers';
import Store from '../../../store'

class CreateIdentity extends React.Component {
  constructor(props) {
    super(props);
    const { activeCoin } = props
    const { name } = activeCoin

    switch (props.modalProps.modalType) {
      case API_REGISTER_ID:
        props.setModalHeader(`Create ${name} ID for ${props.modalProps.nameCommitmentObj.namereservation.name}@`)
        break;
      case API_REGISTER_ID_NAME:
        props.setModalHeader(`Commit Name for ${name} ID`)
        break;
      case API_RECOVER_ID:
        props.setModalHeader(`Recover ${name} Identity`)
        break;
      default:
        break;
    }

    this.state = {
      formStep: ENTER_DATA,
      txData: {},
      loading: false,
      loadingProgress: 0,
      formData: {},
      continueDisabled: true
    }

    this.advanceFormStep = this.advanceFormStep.bind(this)
    this.getFormData = this.getFormData.bind(this)
    this.back = this.back.bind(this)
    this.getContinueDisabled = this.getContinueDisabled.bind(this)
  }

  getFormData(formData) {    
    this.setState({ formData })
  }

  getContinueDisabled(continueDisabled) {
    this.setState({ continueDisabled })
  }

  back() {
    this.setState({
      formStep: ENTER_DATA,
      txData: {},
      continueDisabled: true
    })
  }

  advanceFormStep() {
    const { modalProps, setModalLock } = this.props
    const { formStep, formData } = this.state
    let _txData

    setModalLock(true)
    this.setState({loading: true, loadingProgress: 99}, async () => {      
      try {
        const { 
          chainTicker,
          name,
          controlAddress,
          referralId,
          txid,
          salt,
          revocationAuthority,
          recoveryAuthority,
          privateAddress
        } = formData;

        const _privateAddress = privateAddress == null || privateAddress.length === 0 ? null : privateAddress

        if (modalProps.modalType === API_REGISTER_ID_NAME) {
          _txData = await registerIdName(
            !formStep,
            chainTicker,
            name,
            referralId.length > 0 ? referralId : null
          );
        } else if (modalProps.modalType === API_REGISTER_ID) {
          _txData = await registerId(
            !formStep,
            chainTicker,
            name,
            txid,
            salt,
            [controlAddress], //primaryAddresses,
            1,                // minimumSignatures,
            [],               // contentHashes,
            revocationAuthority,
            recoveryAuthority,
            _privateAddress,
            null,
            referralId && referralId.length > 0 ? referralId : null
          );
        } else if (modalProps.modalType === API_RECOVER_ID) {
          _txData = await recoverId(
            !formStep,
            this.props.activeCoin.id,
            name,
            [controlAddress], //primaryAddresses,
            1,                // minimumSignatures,
            [],               // contentHashes,
            revocationAuthority,
            recoveryAuthority,
            _privateAddress,
          );
        }
        
        this.props.setModalLock(false)
        if (_txData.msg === API_SUCCESS) {
          this.setState({ loadingProgress: 100 }, () => {
            if (formStep === CONFIRM_DATA) {
              if (modalProps.modalType === API_REGISTER_ID_NAME) {
                this.props.dispatch(
                  newSnackbar(
                    SUCCESS_SNACK,
                    "Name commited. Please wait a few minutes for it to get confirmed, and then create your ID!",
                    MID_LENGTH_ALERT
                  )
                );
              } else if (modalProps.modalType === API_REGISTER_ID) {
                this.props.dispatch(
                  newSnackbar(
                    INFO_SNACK,
                    `ID transaction posted with txid ${_txData.result.resulttxid}, please wait for ID to get confirmed.`
                  )
                );
              } else if (modalProps.modalType === API_RECOVER_ID) {
                this.props.dispatch(
                  newSnackbar(
                    INFO_SNACK,
                    `ID recovery transaction posted with txid ${_txData.result.resulttxid}, please wait for it to get confirmed.`
                  )
                );
              }
                
              // Expire transactions and balances
              this.props.dispatch(expireData(this.props.activeCoin.id, API_GET_TRANSACTIONS))
              this.props.dispatch(expireData(this.props.activeCoin.id, API_GET_BALANCES))
              this.props.dispatch(expireData(this.props.activeCoin.id, API_GET_NAME_COMMITMENTS))
              this.props.dispatch(expireData(this.props.activeCoin.id, API_GET_IDENTITIES))
              conditionallyUpdateWallet(Store.getState(), this.props.dispatch, NATIVE, this.props.activeCoin.id, API_GET_TRANSACTIONS)
              conditionallyUpdateWallet(Store.getState(), this.props.dispatch, NATIVE, this.props.activeCoin.id, API_GET_NAME_COMMITMENTS)
            }

            this.setState({ loading: false, txData: {status: API_SUCCESS, ..._txData.result}, formStep: formStep + 1 })
          })
        } else {
          if (modalProps.modalType === API_REGISTER_ID_NAME) {
            this.props.dispatch(newSnackbar(ERROR_SNACK, "Error commiting name."))
          } else if (modalProps.modalType === API_REGISTER_ID) {
            this.props.dispatch(newSnackbar(ERROR_SNACK, "Error creating ID."))
          } else if (modalProps.modalType === API_RECOVER_ID) {
            this.props.dispatch(newSnackbar(ERROR_SNACK, "Error recovering ID."))
          }

          throw new Error(_txData.result)
        }
      } catch (e) {
        this.props.setModalLock(false)
        if (formStep === ENTER_DATA) {
          this.props.dispatch(newSnackbar(ERROR_SNACK, e.message))
          this.setState({ loading: false })
        } else {
          this.setState({ loading: false, txData: {status: API_ERROR, error: e.message}, formStep: formStep + 1 })
        }
      }
    })
  }

  render() {
    return CreateIdentityRender.call(this);
  }
}

const mapStateToProps = (state) => {
  const { chainTicker } = state.modal[CREATE_IDENTITY]

  return {
    activeCoin: state.coins.activatedCoins[chainTicker],
    balances: state.ledger.balances[chainTicker],
    addresses: state.ledger.addresses[chainTicker],
    modalProps: state.modal[CREATE_IDENTITY]
  };
};

export default connect(mapStateToProps)(CreateIdentity);