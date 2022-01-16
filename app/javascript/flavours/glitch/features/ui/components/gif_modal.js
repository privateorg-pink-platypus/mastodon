import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { giphySet, uploadCompose } from 'flavours/glitch/actions/compose';
import IconButton from 'flavours/glitch/components/icon_button';
import ReactGiphySearchbox from 'react-giphy-searchbox';
import { defineMessages, injectIntl } from 'react-intl';

const messages = defineMessages({
  search:    { id: 'giphy.search', defaultMessage: 'Search for GIFs' },
  error:     { id: 'giphy.error', defaultMessage: 'Oops! Something went wrong. Please, try again.' },
  loading:   { id: 'giphy.loading', defaultMessage: 'Loading...' },
  nomatches: { id: 'giphy.nomatches', defaultMessage: 'No matches found.' },
  close:     { id: 'settings.close', defaultMessage: 'Close' },
});

// Utility for converting base64 image to binary for upload
// https://stackoverflow.com/questions/35940290/how-to-convert-base64-string-to-javascript-file-object-like-as-from-file-input-f
function dataURLtoFile(dataurl, filename) {
  let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

const mapStateToProps = state => ({
  options: state.getIn(['compose', 'giphy']),
});

const mapDispatchToProps = dispatch => ({
  /** Set options in the redux store */
  setOpt: (opts) => dispatch(giphySet(opts)),
  /** Submit GIF for upload */
  submit: (file) => dispatch(uploadCompose([file])),
});

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class GIFModal extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    options: ImmutablePropTypes.map,
    onClose: PropTypes.func.isRequired,
    setOpt: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
  };

  onDoneButton = (item) => {
    const url = item.images.original.mp4;
    var modal = this;
    fetch(url).then(function(response) {
      return response.blob();
    }).then(function(blob) {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function() {
        var dataUrl = reader.result;
        const file = dataURLtoFile(dataUrl, 'giphy.mp4');
        modal.props.submit(file);
        modal.props.onClose(); // close dialog
      };
    }).catch(()=>{});
  };

  render () {

    const { intl } = this.props;

    return (
      <div className='modal-root__modal giphy-modal'>
        <div className='giphy-modal__container'>
          <IconButton title={intl.formatMessage(messages.close)} icon='clos' size='16' onClick={this.props.onClose}  style={{float: 'right'}} /><br />
          <ReactGiphySearchbox
            apiKey='1ttK05MF98dLllFFknTAVo0U4CGcQb4J'
            onSelect={item => this.onDoneButton(item)}
            masonryConfig={[
              { columns: 2, imageWidth: 190, gutter: 5 },
              { mq: '700px', columns: 2, imageWidth: 210, gutter: 5 },
            ]}
            autoFocus='true'
            searchPlaceholder={intl.formatMessage(messages.search)}
            messageError={intl.formatMessage(messages.error)}
            messageLoading={intl.formatMessage(messages.loading)}
            messageNoMatches={intl.formatMessage(messages.nomatches)}
            wrapperClassName='giphy-modal__searchbox'
          />
        </div>
      </div>
    );
  }

}
