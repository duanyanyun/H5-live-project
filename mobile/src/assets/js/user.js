/**
 * Created by hanxiao on 2017/4/7.
 */
import app from './app'
export default {
    data () {
        return {
            urls: {
                login: 'http://192.168.6.69:8090/api/user/login'
            },
            user_id: '',
            user_pwd: ''
        }
    },
    methods: {
        login: function () {
            app.get(this.urls.login,{'user_id':this.user_id,'pwd':this.user_pwd}).then(function (data) {

            });

        }
    }
}