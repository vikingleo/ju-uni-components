/**
 * 接口管理
 * @type {string}
 */
let BASE_URL = ''
// #ifndef H5
// BASE_URL = 'https://wx.yunshuiyfb.com/'
BASE_URL = 'https://wx.dev.yfb.yunshuiccc.com/' // dev环境

// #endif
// #ifdef H5
BASE_URL = '/'
// #endif
let prefix = ''
let suffix = '.html'
let url = (url, pre_prefix) => {
    let pre = pre_prefix || prefix
    return BASE_URL + pre + url + suffix
}
export default {
    wx: {
        init: url('tool/wx-sign-key')   // 获取微信配置
    },
    index: url('project/index'),
    public: {
        about: url('index/about')
    },
    tool: {
        sms: url('index/code'),
        upload_by_base64: url('tool/image-string'),
        idcard_ocr: url('tool/ocr-identity-card'),
        bank_card_ocr: url('tool/bank-ocr'),
        bank_card_ocr_by_number: url('tool/bank-car-address'),
        file_upload: url('tool/upload'),
        upload_image_general: url('tool/image'),    //普通的图片上传
        video_upload: url('tool/video')

    },
    account: {
        login: url('index/wx-login'),
        check_login: url('user/is-login')
    },
    auth: {
        check: url('authentication/isauth'),
        submit: url('user/authentication'),
        detail: url('authentication/detail')
    },
    order: {
        list: url('signing/index'),
        detail: url('signing/detail'),
        feedback: url('signing/voucher-upload'),  //项目反馈验收
        feedback_list: url('signing/voucher-list'),  //项目反馈验收列表
        feedback_remove: url('signing/voucher-del')  //项目反馈验收删除
    },
    project: {
        config: url('project/config'),
        search: url('project/invitation'),
        detail: url('project/detail'),
        signing: url('signing/signing'),
        signature_account: url('project/project-account'),  // {order_sn:String}
        feedback_diy: url('diytpl/api/index/project-form-config'),  //反馈自定义表单
    },
    user: {
        info: url('user/index'),
        modify_avatar: url('user/portrait')   //修改头像
    },
    bank: {
        edit: url('user/bank-modify')
    },
    payment: {
        detail: url('user/account'),
        list_by_project: url('project/project-account'),
        make_money: url('user/verify'),
        bind: url('user/account-bind'),
        payment_info: url('user/account-bind-pre'),
        wx_auth: url('project/wx-auth')
    },
    self_employed: {
        submit: url('selfemployed/self-person'),
        detail: url('selfemployed/detail'),
        generate_name: url('selfemployed/create-name'),
        submit_self_employed: url('selfemployed/sub'),
        self_info: url('selfemployed/user-info'),
        agreement: url('index/self-employed')  //个体户注册协议
    },
    bill: {
        list: url('order/index'),
        detail: url('order/detail')
    },
    article: {
        list: url('top/topic-list'),
        detail: url('top/topic')
    },
    banner: {
        help: url('index/help-banner')   // 新手帮助
    },
    agreement: {
        service: url('index/agreement'),  //协议
        privacy: url('index/privacy')  //隐私声明
    },
    invoice: {
        list: url('receipt/index'),  //发票列表
        detail: url('receipt/detail'),  //发票列表
        open: url('receipt/apply')  //申请开票
    }

}
