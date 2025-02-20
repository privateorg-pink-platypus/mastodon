//  Package imports.
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import spring from 'react-motion/lib/spring';

//  Components.
import IconButton from 'flavours/glitch/components/icon_button';
import TextIconButton from './text_icon_button';
import Dropdown from './dropdown';
import PrivacyDropdown from './privacy_dropdown';
import ImmutablePureComponent from 'react-immutable-pure-component';

//  Utils.
import Motion from 'flavours/glitch/util/optional_motion';
import { pollLimits } from 'flavours/glitch/util/initial_state';

//  Messages.
const messages = defineMessages({
  advanced_options_icon_title: {
    defaultMessage: 'Advanced options',
    id: 'advanced_options.icon_title',
  },
  attach: {
    defaultMessage: 'Attach...',
    id: 'compose.attach',
  },
  content_type: {
    defaultMessage: 'Content type',
    id: 'content-type.change',
  },
  doodle: {
    defaultMessage: 'Draw something',
    id: 'compose.attach.doodle',
  },
  gif: {
    defaultMessage: 'Embed GIF',
    id: 'compose.attach.gif',
  },
  html: {
    defaultMessage: 'HTML',
    id: 'compose.content-type.html',
  },
  local_only_long: {
    defaultMessage: 'Do not post to other instances',
    id: 'advanced_options.local-only.long',
  },
  local_only_short: {
    defaultMessage: 'Local-only',
    id: 'advanced_options.local-only.short',
  },
  markdown: {
    defaultMessage: 'Markdown',
    id: 'compose.content-type.markdown',
  },
  plain: {
    defaultMessage: 'Plain text',
    id: 'compose.content-type.plain',
  },
  spoiler: {
    defaultMessage: 'Hide text behind warning',
    id: 'compose_form.spoiler',
  },
  threaded_mode_long: {
    defaultMessage: 'Automatically opens a reply on posting',
    id: 'advanced_options.threaded_mode.long',
  },
  threaded_mode_short: {
    defaultMessage: 'Threaded mode',
    id: 'advanced_options.threaded_mode.short',
  },
  upload: {
    defaultMessage: 'Upload a file',
    id: 'compose.attach.upload',
  },
  add_poll: {
    defaultMessage: 'Add a poll',
    id: 'poll_button.add_poll',
  },
  remove_poll: {
    defaultMessage: 'Remove poll',
    id: 'poll_button.remove_poll',
  },
});

export default @injectIntl
class ComposerOptions extends ImmutablePureComponent {

  static propTypes = {
    acceptContentTypes: PropTypes.string,
    advancedOptions: ImmutablePropTypes.map,
    disabled: PropTypes.bool,
    allowMedia: PropTypes.bool,
    hasMedia: PropTypes.bool,
    allowPoll: PropTypes.bool,
    hasPoll: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    onChangeAdvancedOption: PropTypes.func,
    onChangeVisibility: PropTypes.func,
    onChangeContentType: PropTypes.func,
    onTogglePoll: PropTypes.func,
    onDoodleOpen: PropTypes.func,
    onEmbedGiphy: PropTypes.func,
    onModalClose: PropTypes.func,
    onModalOpen: PropTypes.func,
    onToggleSpoiler: PropTypes.func,
    onUpload: PropTypes.func,
    privacy: PropTypes.string,
    contentType: PropTypes.string,
    resetFileKey: PropTypes.number,
    spoiler: PropTypes.bool,
    showContentTypeChoice: PropTypes.bool,
  };

  //  Handles file selection.
  handleChangeFiles = ({ target: { files } }) => {
    const { onUpload } = this.props;
    if (files.length && onUpload) {
      onUpload(files);
    }
  }

  //  Handles attachment clicks.
  handleClickAttach = (name) => {
    const { fileElement } = this;
    const { onDoodleOpen, onEmbedGiphy } = this.props;

    //  We switch over the name of the option.
    switch (name) {
    case 'upload':
      if (fileElement) {
        fileElement.click();
      }
      return;
    case 'doodle':
      if (onDoodleOpen) {
        onDoodleOpen();
      }
      return;
    case 'gif':
      if (onEmbedGiphy) {
        onEmbedGiphy();
      }
      return;
    }
  }

  //  Handles a ref to the file input.
  handleRefFileElement = (fileElement) => {
    this.fileElement = fileElement;
  }

  //  Rendering.
  render () {
    const {
      acceptContentTypes,
      advancedOptions,
      contentType,
      disabled,
      allowMedia,
      hasMedia,
      allowPoll,
      hasPoll,
      intl,
      onChangeAdvancedOption,
      onChangeContentType,
      onChangeVisibility,
      onTogglePoll,
      onModalClose,
      onModalOpen,
      onToggleSpoiler,
      privacy,
      resetFileKey,
      spoiler,
      showContentTypeChoice,
    } = this.props;

    const contentTypeItems = {
      plain: {
        icon: 'file-text',
        name: 'text/plain',
        text: <FormattedMessage {...messages.plain} />,
      },
      html: {
        icon: 'code',
        name: 'text/html',
        text: <FormattedMessage {...messages.html} />,
      },
      markdown: {
        icon: 'arrow-circle-down',
        name: 'text/markdown',
        text: <FormattedMessage {...messages.markdown} />,
      },
    };

    //  The result.
    return (
      <div className='composer--options'>
        <input
          accept={acceptContentTypes}
          disabled={disabled || !allowMedia}
          key={resetFileKey}
          onChange={this.handleChangeFiles}
          ref={this.handleRefFileElement}
          type='file'
          multiple
          style={{ display: 'none' }}
        />
        <Dropdown
          disabled={disabled || !allowMedia}
          icon='paperclip'
          items={[
            {
              icon: 'cloud-upload',
              name: 'upload',
              text: <FormattedMessage {...messages.upload} />,
            },
            {
              icon: 'paint-brush',
              name: 'doodle',
              text: <FormattedMessage {...messages.doodle} />,
            },
            {
              icon: 'file-image-o',
              name: 'gif',
              text: <FormattedMessage {...messages.gif} />,
            },
          ]}
          onChange={this.handleClickAttach}
          onModalClose={onModalClose}
          onModalOpen={onModalOpen}
          title={intl.formatMessage(messages.attach)}
        />
        {!!pollLimits && (
          <IconButton
            active={hasPoll}
            disabled={disabled || !allowPoll}
            icon='tasks'
            inverted
            onClick={onTogglePoll}
            size={18}
            style={{
              height: null,
              lineHeight: null,
            }}
            title={intl.formatMessage(hasPoll ? messages.remove_poll : messages.add_poll)}
          />
        )}
        <hr />
        <PrivacyDropdown
          disabled={disabled}
          onChange={onChangeVisibility}
          onModalClose={onModalClose}
          onModalOpen={onModalOpen}
          value={privacy}
        />
        {showContentTypeChoice && (
          <Dropdown
            disabled={disabled}
            icon={(contentTypeItems[contentType.split('/')[1]] || {}).icon}
            items={[
              contentTypeItems.plain,
              contentTypeItems.html,
              contentTypeItems.markdown,
            ]}
            onChange={onChangeContentType}
            onModalClose={onModalClose}
            onModalOpen={onModalOpen}
            title={intl.formatMessage(messages.content_type)}
            value={contentType}
          />
        )}
        {onToggleSpoiler && (
          <TextIconButton
            active={spoiler}
            ariaControls='glitch.composer.spoiler.input'
            label='CW'
            onClick={onToggleSpoiler}
            title={intl.formatMessage(messages.spoiler)}
          />
        )}
        <Dropdown
          active={advancedOptions && advancedOptions.some(value => !!value)}
          disabled={disabled}
          icon='ellipsis-h'
          items={advancedOptions ? [
            {
              meta: <FormattedMessage {...messages.local_only_long} />,
              name: 'do_not_federate',
              on: advancedOptions.get('do_not_federate'),
              text: <FormattedMessage {...messages.local_only_short} />,
            },
            {
              meta: <FormattedMessage {...messages.threaded_mode_long} />,
              name: 'threaded_mode',
              on: advancedOptions.get('threaded_mode'),
              text: <FormattedMessage {...messages.threaded_mode_short} />,
            },
          ] : null}
          onChange={onChangeAdvancedOption}
          onModalClose={onModalClose}
          onModalOpen={onModalOpen}
          title={intl.formatMessage(messages.advanced_options_icon_title)}
        />
      </div>
    );
  }

}
