import React, { Component } from 'react';
import SelectedCrossingContainer from 'components/Shared/CrossingMapPage/SelectedCrossingContainer';
import CrossingMapSearchBar from 'components/Shared/CrossingMapPage/CrossingMapSearchBar';
import CrossingSidebarNearbyCrossingItem from 'components/Shared/CrossingMapPage/CrossingSidebarNearbyCrossingItem';
import 'components/Shared/CrossingMapPage/CrossingMapSidebar.css';
import FontAwesome from 'react-fontawesome';
import classnames from 'classnames';

const FilterCheckbox = ({defaultChecked, onClick, title}) => (
  <label className="CrossingMapPage_sidebar-filter">
    <input
      className="CrossingMapPage_sidebar-filter-checkbox"
      type="checkbox"
      defaultChecked={defaultChecked}
      onClick={onClick}
    />
     {title}
  </label>
)

class CrossingMapSidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: true,
      showFilters: false,
      searchFocused: false,
    };
  }

  toggleSidebar = () => {
    this.setState({ visible: !this.state.visible });
  };

  toggleFilters = () => {
    this.setState({ showFilters: !this.state.showFilters });
  };

  toggleSearchFocus = focused => {
    this.setState({ searchFocused: focused });
  };

  render() {
    const { visible, searchFocused } = this.state;
    const {
      toggleShowOpen,
      toggleShowClosed,
      toggleShowCaution,
      toggleShowLongterm,
      showOpen,
      showClosed,
      showCaution,
      showLongterm,
      searchQuery,
      searchQueryUpdated,
      selectedCrossingId,
      selectCrossing,
      currentUser,
      visibleCrossings,
      allCommunities,
      selectedCrossingName,
      center,
      setSelectedLocationCoordinates,
      setSelectedCommunity,
    } = this.props;

    return (
      <div className="CrossingMapSidebar__overlay-container">
        {visible && (
          <div className="CrossingMapSidebar__content">
            <CrossingMapSearchBar
              selectedCrossingId={selectedCrossingId}
              selectCrossing={selectCrossing}
              searchQuery={searchQuery}
              searchQueryUpdated={searchQueryUpdated}
              selectedCrossingName={selectedCrossingName}
              center={center}
              setSelectedLocationCoordinates={setSelectedLocationCoordinates}
              toggleSearchFocus={this.toggleSearchFocus}
              communities={allCommunities}
              communityId={currentUser && currentUser.communityId}
              setSelectedCommunity={setSelectedCommunity}
            />

            {!searchFocused && (
              <div>
                {selectedCrossingId && (
                  <SelectedCrossingContainer
                    crossingId={selectedCrossingId}
                    currentUser={currentUser}
                    selectCrossing={selectCrossing}
                  />
                )}
                <div className="CrossingMapPage_sidebar-filter-sort-toggle-container">
                  <div
                    className={classnames(
                      'CrossingMapPage_sidebar-filter-toggle',
                      {
                        selected: this.state.showFilters,
                      },
                    )}
                    onClick={this.toggleFilters}
                  >
                    <div className="CrossingMapPage_sidebar-filter-toggle-text">
                      {this.state.showFilters ? (
                        <FontAwesome name="minus" ariaLabel="Hide" />
                      ) : (
                        <FontAwesome name="plus" ariaLabel="Show" />
                      )}{' '}
                      FILTER
                    </div>
                  </div>
                </div>
                {this.state.showFilters && (
                  <div className="CrossingMapPage_sidebar-filter-container">
                    <FilterCheckbox
                      title="Open"
                      defaultChecked={showOpen}
                      onClick={toggleShowOpen}
                    />
                    <FilterCheckbox
                      title="Closed"
                      defaultChecked={showClosed}
                      onClick={toggleShowClosed}
                    />
                    <FilterCheckbox
                      title="Caution"
                      defaultChecked={showCaution}
                      onClick={toggleShowCaution}
                    />
                    <FilterCheckbox
                      title="Long Term Closure"
                      defaultChecked={showLongterm}
                      onClick={toggleShowLongterm}
                    />
                  </div>
                )}
                <div className="CrossingMapPage_sidebar-nearbycrossings">
                  {visibleCrossings.map(c => (
                    <CrossingSidebarNearbyCrossingItem
                      key={c.id}
                      latestStatus={c.latestStatus}
                      statusId={c.statusId}
                      crossingId={c.id}
                      crossingName={c.crossingName}
                      communityIds={c.communityIds}
                      allCommunities={allCommunities}
                      selectCrossing={selectCrossing}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <div
          className="CrossingMapPage_sidebar-toggle"
          onClick={this.toggleSidebar}
        >
          {visible ? (
            <FontAwesome
              name="angle-left"
              size="2x"
              onClick={this.toggleSidebar}
            />
          ) : (
            <FontAwesome
              name="angle-right"
              size="2x"
              onClick={this.toggleSidebar}
            />
          )}
        </div>
      </div>
    );
  }
}

export default CrossingMapSidebar;
