import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, withIonLifeCycle, IonButton, IonIcon, IonList, IonItem, IonToast, IonInfiniteScroll, IonInfiniteScrollContent, IonLoading } from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';


import { Settings } from '../models/Settings';
import { TmpSettings } from '../models/TmpSettings';
import Globals from '../Globals';
import { shareSocial } from 'ionicons/icons';

import './Pages.css';
import { Animal } from '../models/Animal';
import AnimalCell from '../components/AnimalCell';

interface Props {
  dispatch: Function;
  settings: Settings;
  tmpSettings: TmpSettings;
}

interface State {
  animalsLoaded: Animal[];
  isScrollOn: boolean;
  showToast: boolean;
  toastMessage: string;
}

interface PageProps extends Props, RouteComponentProps<{
  tab: string;
}> { }

class _ListScreen extends React.Component<PageProps, State> {
  timeoutID = null

  constructor(props: any) {
    super(props);
    this.state = {
      animalsLoaded: [],
      isScrollOn: false,
      showToast: false,
      toastMessage: '',
    };

    this.fetachDataPageByPage(true);
  }

  page = 0;
  rows = 20;
  async fetachDataPageByPage(fromPage0: boolean = false) {
    await new Promise<void>((ok, fail) => {
      let timer = setInterval(() => {
        if (!this.props.tmpSettings.isLoading) {
          clearInterval(timer);
          ok();
        }
      }, 50);
    });

    if (fromPage0) {
      this.page = 0;
    }

    console.log(`Loading page ${this.page}`);

    const animalsLength = this.props.tmpSettings.animals.length;

    const animalsRandomlySelected = (new Array(this.rows).fill(0)).map(v => this.props.tmpSettings.animals[Math.floor(Math.random() * animalsLength)]);

    this.page += 1;
    this.setState({
      animalsLoaded: fromPage0 ? animalsRandomlySelected : [...this.state.animalsLoaded, ...animalsRandomlySelected],
      isScrollOn: this.state.animalsLoaded.length < this.props.tmpSettings.animals.length,
    });

    return true;
  }

  async selectDetail(animalId: number) {
    this.props.history.push(`${Globals.pwaUrl}/${this.props.match.params.tab}/${animalId}`);
  }

  renderRows() {
    return this.state.animalsLoaded.map((a, i) =>
      <IonItem className='textFont' button={true} key={`item${i}`} onClick={(e) => {
        this.selectDetail(a.animal_id);
      }}>
        <AnimalCell
          {...{
            animal: a,
            ...this.props
          }}
        />
      </IonItem>);
  }

  render() {
    return (
      this.props.tmpSettings.isLoading ?
        <IonLoading
          cssClass='uiFont'
          isOpen={this.props.tmpSettings.isLoading}
          message={'載入中...'}
        />
        :
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonTitle className='uiFont'>認養動物</IonTitle>

              <IonButton fill="clear" slot='end' onClick={e => {
                this.props.dispatch({
                  type: "TMP_SET_KEY_VAL",
                  key: 'shareTextModal',
                  val: {
                    show: true,
                    text: decodeURIComponent(window.location.href),
                  },
                });
              }}>
                <IonIcon icon={shareSocial} slot='icon-only' />
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent style={{ textAlign: 'center' }}>

            <IonList>
              {this.renderRows()}

              <IonInfiniteScroll threshold="100px"
                disabled={!this.state.isScrollOn}
                onIonInfinite={(ev: CustomEvent<void>) => {
                  this.fetachDataPageByPage();
                  (ev.target as HTMLIonInfiniteScrollElement).complete();
                }}>
                <IonInfiniteScrollContent
                  loadingText="載入中...">
                </IonInfiniteScrollContent>
              </IonInfiniteScroll>
            </IonList>

            <IonToast
              cssClass='uiFont'
              isOpen={this.state.showToast}
              onDidDismiss={() => this.setState({ showToast: false })}
              message={this.state.toastMessage}
              duration={2000}
            />
          </IonContent>
        </IonPage>
    );
  }
};

const mapStateToProps = (state: any /*, ownProps*/) => {
  return {
    tmpSettings: state.tmpSettings,
    settings: state.settings
  }
};

//const mapDispatchToProps = {};

const ListScreen = withIonLifeCycle(_ListScreen);

export default connect(
  mapStateToProps,
)(ListScreen);
