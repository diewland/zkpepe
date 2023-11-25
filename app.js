// proxy
async function proxy(url) {
  return await $.ajax({
      url: './proxy.php',
      method: 'POST',
      data: { url: url },
  });
}

// api
const API_AMOUNT = 'https://www.zksyncpepe.com/resources/amounts/{}.json';
async function get_amount(addr) {
  let url = API_AMOUNT.replace('{}', addr);
  let resp = await proxy(url);
  // data format => "[9999]"
  if (resp[0] != '[') return -1; // not found
  return JSON.parse(resp)[0];
}

$('.check-btn').click(async _ => {
  // update loading UI (1/2)
  $('.check-btn').addClass('disabled');
  $('.result table tbody').html('');
  $('.result').removeClass('d-none');
  $('.loading').removeClass('d-none');
  // fetch data addr by addr
  let wallets = $('#wallets').val().trim().split('\n');
  for (let addr of wallets) {
    addr = addr.trim();
    let amount = 0;
    if (Web3.utils.isAddress(addr)) {
      // 1) lowercase address
      amount = await get_amount(addr.toLowerCase());
      // 2) checksum address
      if (amount < 0) amount = await get_amount(Web3.utils.toChecksumAddress(addr));
      // 3) zero
      if (amount < 0) amount = 0;
    }
    $('.result table tbody').append(`
      <tr>
        <td>${amount}</td>
        <td>${addr}</td>
      </tr>
    `)
  };
  // update loading UI (2/2)
  $('.check-btn').removeClass('disabled');
  $('.loading').addClass('d-none');
});
