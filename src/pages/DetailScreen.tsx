import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, withIonLifeCycle, IonButton, IonList, IonItem, IonIcon, IonToast, IonImg, IonLoading, IonLabel } from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';

import { Settings } from '../models/Settings';
import { TmpSettings } from '../models/TmpSettings';

import './Pages.css';
import { arrowBack, bookmark, shareSocial } from 'ionicons/icons';

var dispFields = ["流水編號", "區域編號", "所屬縣市代碼", "所屬收容所代碼", "實際所在地", "類型", "性別", "體型", "毛色", "年紀", "是否絕育", "是否施打狂犬病疫苗", "尋獲地", "網頁標題", "狀態", "資料備註", "其他說明", "開放認養時間(起)", "開放認養時間(迄)", "資料異動時間", "資料建立時間", "所屬收容所名稱", "圖片名稱(原始名稱)", "異動時間", "地址", "聯絡電話"];

var keys = ["animal_id", "animal_subid", "animal_area_pkid", "animal_shelter_pkid", "animal_place", "animal_kind", "animal_sex", "animal_bodytype", "animal_colour", "animal_age", "animal_sterilization", "animal_bacterin", "animal_foundplace", "animal_title", "animal_status", "animal_remark", "animal_caption", "animal_opendate", "animal_closeddate", "animal_update", "animal_createtime", "shelter_name", "album_name", "cDate", "shelter_address", "shelter_tel"];

interface Props {
  dispatch: Function;
  settings: Settings;
  tmpSettings: TmpSettings;
}

interface State {
  showToast: boolean;
  toastMessage: string;
}

interface PageProps extends Props, RouteComponentProps<{
  tab: string;
  animalId: string;
}> { }

class _DetailScreen extends React.Component<PageProps, State> {
  constructor(props: PageProps) {
    super(props);
    this.state = {
      showToast: false,
      toastMessage: '',
    };

  }

  get animal() {
    return this.props.tmpSettings.animals.find((a) => a.animal_id === +this.props.match.params.animalId);
  }

  addBookmarkHandler() {
    this.props.dispatch({
      type: "ADD_BOOKMARK",
      bookmark: this.animal?.animal_id,
    });
    this.setState({ showToast: true, toastMessage: '書籤新增成功！' });
  }

  render() {
    var rows = [];
    if (this.animal != null) {
      rows = [];
      for (var i = 0; i < keys.length; i++) {
        rows.push(<IonItem key={i} className='textFont'>{dispFields[i] + "：" + (this.animal as any)[keys[i]]}</IonItem>);
      }
    }

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
              <IonButton fill="clear" slot='start' onClick={e => this.props.history.goBack()}>
                <IonIcon icon={arrowBack} slot='icon-only' />
              </IonButton>

              <IonTitle className='uiFont'>詳細資訊</IonTitle>

              <IonButton fill="clear" slot='end' onClick={e => {
                this.addBookmarkHandler();
              }}>
                <IonIcon icon={bookmark} slot='icon-only' />
              </IonButton>

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
            {this.animal == null ?
              <IonLabel className='ion-text-wrap textFont'>此認養動物資料已不存在。</IonLabel>
              :
              <>
                <IonImg src={this.animal?.album_file || ''} className='detailScreenImg' alt='' />
                <IonList>
                  {rows}
                </IonList>
              </>
            }

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
}

const mapStateToProps = (state: any /*, ownProps*/) => {
  return {
    tmpSettings: state.tmpSettings,
    settings: state.settings
  }
};

//const mapDispatchToProps = {};

const DetailScreen = withIonLifeCycle(_DetailScreen);

export default connect(
  mapStateToProps,
)(DetailScreen);
