import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import Autosuggest from 'react-autosuggest';
import MapboxClient from 'mapbox';
import { withRouter } from 'react-router';

import CrossingMapSearchCrossingSuggestions from 'components/Shared/CrossingMapPage/CrossingMapSearchCrossingSuggestions';
import { MapboxAccessToken } from 'constants/MapboxConstants';
import 'components/Shared/CrossingMapPage/CrossingMapSearchBar.css';

import CloseLightSvg from 'images/close-light.svg';
import LocationLightSvg from 'images/location-light.svg';
import SearchLightSvg from 'images/search-light.svg';

const mapboxClient = new MapboxClient(MapboxAccessToken);

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => {
  return suggestion.place_name || suggestion.name;
};

// Use your imagination to render suggestions.
const Suggestion = suggestion => (
  <div className="CrossingMapSearchBar__suggestion-container">
    <div className="CrossingMapSearchBar__suggestion-icon">
      {suggestion.__typename === 'Crossing' && (
        <FontAwesome name="map-pin" size="2x" />
      )}
      {suggestion.__typename === 'Community' && (
        <FontAwesome name="globe" size="2x" />
      )}
      {suggestion.type === 'Feature' && (
        <FontAwesome name="map-marker" size="2x" />
      )}
    </div>
    <div className="CrossingMapSearchBar__suggestion-text">
      {suggestion.place_name || suggestion.name}
    </div>
  </div>
);

const renderSectionTitle = section => {
  return null;
};

const getSectionSuggestions = section => {
  return section.suggestions;
};

const formatSearchQuery = query => {
  return `%${query.replace(/ /g, '%')}%`;
};

class CrossingMapSearchBar extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  constructor(props, ...args) {
    super(props, ...args);

    this.state = {
      isSearching: this.computeIsSearching(props),
      typedValue: '',
      selectedValue: '',
      mapboxSuggestions: [],
      crossingSuggestions: -[],
      communitySuggestions: [],
    };
  }

  computeIsSearching(props) {
    return !(
      props.selectedCrossingId || props.match.params.selectedCommunityId
    );
  }

  componentDidUpdate(prevProps) {
    const wasSearching = this.computeIsSearching(prevProps);
    const isSearching = this.computeIsSearching(this.props);
    if (wasSearching !== isSearching) {
      this.setState({ isSearching });
    }
  }

  onChange = (event, { newValue, method }) => {
    if (method === 'type') {
      this.setState({
        typedValue: newValue,
        selectedValue: null,
      });
    } else if (method === 'escape') {
      this.setState({
        selectedValue: null,
      });
    } else if (method === 'enter' || method === 'click') {
      this.setState({
        selectedValue: newValue,
        typedValue: newValue,
      });
    } else if (method === 'down' || method === 'up') {
      this.setState({
        selectedValue: newValue,
      });
    }
  };

  onSuggestionSelected = (
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method },
  ) => {
    // If we've selected a crossing, center in on it
    if (suggestion.__typename === 'Crossing') {
      this.props.selectCrossing(suggestion.id);
    }

    // If we've selected a mapbox location, center on it
    if (suggestion.type === 'Feature') {
      this.props.setSelectedLocationCoordinates(suggestion.center);
    }

    if (suggestion.__typename === 'Community') {
      this.props.history.push(`/map/community/${suggestion.id}`);
    }

    // Unfocus the search bar
    this.autosuggestInput.blur();
  };

  // Autosuggest will call this function every time you need to update suggestions.
  onSuggestionsFetchRequested = ({ value }) => {
    const { center, communityId, communities } = this.props;

    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    // Get the suggestions from the mapbox geocoder
    if (inputLength > 2) {
      mapboxClient.geocodeForward(
        inputValue,
        {
          proximity: { latitude: center.lat, longitude: center.lng },
          // Hardcoding this for now to get better results
          // TODO: Design a better solution for accurate geocode results
          bbox: [-100, 27, -94, 34],
        },
        (err, res) => {
          this.setState({ mapboxSuggestions: res.features });
        },
      );
    } else {
      this.setState({ mapboxSuggestions: [] });
    }

    // If we aren't filtering by community, get the communities
    if (!communityId ) {
      const communitySuggestions = communities
        .filter(c => c.name.toLowerCase().includes(inputValue))
        .slice(0, 4);
      this.setState({ communitySuggestions: communitySuggestions });
    }
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      mapboxSuggestions: [],
      communitySuggestions: [],
    });
  };

  resetMap = () => {
    this.props.selectCrossing(null, null);
    this.props.history.push('/map');
  };

  updateCrossingSuggestions = suggestions => {
    this.setState({
      crossingSuggestions: suggestions,
    });
  };

  onInputFocus = () => {
    this.props.toggleSearchFocus(true);
  };

  onInputBlur = () => {
    this.props.toggleSearchFocus(false);
  };

  render() {
    const { selectedCrossingId } = this.props;
    const { selectedCommunityId } = this.props.match.params;

    const {
      typedValue,
      selectedValue,
      mapboxSuggestions,
      crossingSuggestions,
      communitySuggestions,
    } = this.state;

    const suggestions = [
      {
        title: 'Communities',
        suggestions: communitySuggestions,
      },
      {
        title: 'Crossings',
        suggestions: crossingSuggestions,
      },
      {
        title: 'Locations',
        suggestions: mapboxSuggestions,
      },
    ];

    const value = selectedValue ? selectedValue : typedValue;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Search...',
      value,
      onChange: this.onChange,
      onFocus: this.onInputFocus,
      onBlur: this.onInputBlur,
    };

    const formattedQuery = formatSearchQuery(typedValue);

    return (
      <div>
        <CrossingMapSearchCrossingSuggestions
          searchQuery={formattedQuery}
          updateSuggestions={this.updateCrossingSuggestions}
        />
        <div className="CrossingMapSearchBar__header">
          Search for a place, community, or crossing
        </div>
        <div className="CrossingMapSearchBar__container">
          {!this.state.isSearching && (selectedCrossingId || selectedCommunityId) && (
            <div className="CrossingMapSearchBar__selected-container">
              <div className="CrossingMapSearchBar__icon">
                <img src={LocationLightSvg} alt="" />
              </div>
              <div className="CrossingMapSearchBar__title">
                {selectedCrossingId || selectedCommunityId}
              </div>
              <div
                className="CrossingMapSearchBar__icon"
                onClick={this.resetMap}
              >
                <img src={CloseLightSvg} alt="Clear" />
              </div>
              <div
                className="CrossingMapSearchBar__icon"
                onClick={() => {
                  this.setState({ isSearching: true });
                }}
              >
                <img src={SearchLightSvg} alt="Search" />
              </div>
            </div>
          )}
          {this.state.isSearching && (
              <div className="CrossingMapSearchBar__search-container">
                <div className="CrossingMapSearchBar__icon">
                  <img src={SearchLightSvg} alt="Search" />
                </div>
                <div className="CrossingMapSearchBar__search">
                  <Autosuggest
                    onBlur={() => {
                      this.setState({ isSearching: false });
                    }}
                    ref={autosuggest => {
                      if (autosuggest !== null) {
                        this.autosuggestInput = autosuggest.input;
                      }
                    }}
                    suggestions={suggestions}
                    multiSection={true}
                    getSectionSuggestions={getSectionSuggestions}
                    renderSectionTitle={renderSectionTitle}
                    onSuggestionsFetchRequested={
                      this.onSuggestionsFetchRequested
                    }
                    onSuggestionsClearRequested={
                      this.onSuggestionsClearRequested
                    }
                    onSuggestionSelected={this.onSuggestionSelected}
                    onSuggestionHighlighted={this.onSuggestionHighlighted}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={Suggestion}
                    inputProps={inputProps}
                    shouldRenderSuggestions={() => true}
                    focusInputOnSuggestionClick={false}
                  />
                </div>
                <div
                  className="CrossingMapSearchBar__icon"
                  onClick={this.resetMap}
                >
                  <img src={CloseLightSvg} alt="Clear" />
                </div>
              </div>
            )}
        </div>
      </div>
    );
  }
}

export default withRouter(CrossingMapSearchBar);
