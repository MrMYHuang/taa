import React from 'react';
import { IonLabel, IonThumbnail, IonImg } from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Settings } from '../models/Settings';
import { TmpSettings } from '../models/TmpSettings';
import { Animal } from '../models/Animal';

interface Props {
  animal: Animal;
  dispatch: Function;
  settings: Settings;
  tmpSettings: TmpSettings;
}

interface State {
}

interface PageProps extends Props, RouteComponentProps<{
}> { }

var dispFields = ["性別", "年紀", "開放認養時間(起)", "所屬收容所名稱", "異動時間"]

var keys = ["animal_sex", "animal_age", "animal_opendate", "shelter_name", "cDate"]

class _AnimalCell extends React.Component<PageProps, State> {
  render() {
    var rows = [];
    for (var i = 0; i < keys.length; i++) {
      rows.push(<div key={`text${i}`}>&bull; {dispFields[i] + "：" + (this.props.animal as any)[keys[i]]}</div>);
    }

    var img = this.props.animal.album_file;

    return (<>
      <IonThumbnail slot='start' className='animalCellImg'>
        <IonImg src={img} alt='' />
      </IonThumbnail>
      <IonLabel className='ion-text-wrap'>
        {rows}
      </IonLabel>
    </>);
  }
}

const mapStateToProps = (state: any /*, ownProps*/) => {
  return {
    tmpSettings: state.tmpSettings,
    settings: state.settings
  }
};

//const mapDispatchToProps = { };

const AnimalCell = _AnimalCell;

export default connect(
  mapStateToProps,
)(AnimalCell);
