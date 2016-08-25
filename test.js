var steem = require('./index');

function getSteemPerMvest(callback) {
    steem.api.getDynamicGlobalProperties(function(err, result){
        //console.log(result);
        var total_vesting_fund_steem = result.total_vesting_fund_steem;
        total_vesting_fund_steem = Number(total_vesting_fund_steem.substring(0, total_vesting_fund_steem.length - 6));


        var total_vesting_shares = result.total_vesting_shares;
        total_vesting_shares = Number(total_vesting_shares.substring(0, total_vesting_shares.length - 6));

        var steem_per_mvest = (total_vesting_fund_steem / (total_vesting_shares / 1000000)).toFixed(3);

        callback(steem_per_mvest);
    });
}

function getAccount(callback, steemPerMVest) {
    steem.api.getAccounts(['tyler-fletcher'], function(err, result) {
        callback(result, steemPerMVest);
    });
}

// Data handler
function handleUser(account, steemPerMVest) {
    var vest = account[0].vesting_shares;
    vest = Number(vest.substring(0, vest.length - 6));

    var SP = ((vest * steemPerMVest)/1000000).toFixed(3);

    console.log("My Steem Power: " + SP);
};

// Data handler
function handleData(steem_per_mvest) {
    var steemPerMVest = steem_per_mvest;
    getAccount(handleUser, steemPerMVest);
};

getSteemPerMvest(handleData);
