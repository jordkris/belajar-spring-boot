let closeButton = 'Close <i class="fa-solid fa-xmark"></i>';
let noButton = 'No <i class="fa-solid fa-xmark"></i>';
let yesButton = 'Yes <i class="fa-solid fa-circle-check"></i>';
let saveButton = 'Save <i class="fa-solid fa-floppy-disk"></i>';
let sendButton = 'Send <i class="fas fa-money-bill-transfer"></i>';

let formatCurrency = (number) => {
    return 'Rp '+Intl.NumberFormat('id-ID').format(number);
}
let notification = (id, status, message) => {
    $(id).prepend(`
            <div class="alert alert-${status} alert-dismissible fade show" role="alert">
                ${message}
                    <button  class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `);
}
let loadingButton = (id, disabled, before = '') => {
    $(id).prop('disabled', disabled).html(before == '' ? 'Loading <i class="fas fa-spinner fa-spin"></i>' : before);
}
let insertString = (target, position) => {
    return target.slice(0, position) + formatCurrency(target.slice(position));
}
let loadData = () => {
    $.ajax({
        url: '/api/getAccounts',
        type: 'GET',
        beforeSend: () => {
            $('#data-account').html(`
                    <tr>
                        <td colspan="6">
                            Loading <i class="fas fa-spinner fa-spin"></i>
                        </td>
                    </tr>
                `);
        },
        success: (data) => {
            let tableRows = '';
            if (data.length) {
                data.forEach((row, i) => {
                    tableRows += `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${row.accountNumber}</td>
                        <td>${row.accountName}</td>
                        <td>${formatCurrency(row.accountBalance)}</td>
                        <td>
                        <button id="use-${i + 1}" class="btn btn-success use" data-toggle="modal" data-target="#modal" data-account="${row.accountNumber},${row.accountName}">Use <i class="fa-solid fa-sack-dollar"></i></button>
                        <button id="history-${i + 1}" class="btn btn-info history" data-toggle="modal" data-target="#modal" data-account="${row.accountNumber},${row.accountName},${row.accountBalance}">History <i class="fa-solid fa-clock-rotate-left"></i></button>
                        </td>
                        <td>
                        <button id="edit-${i + 1}" class="btn btn-warning edit" data-toggle="modal" data-target="#modal" data-account="${row.accountNumber},${row.accountName}">Edit <i class="fa-solid fa-user-pen"></i></button>
                        <button id="delete-${i + 1}" class="btn btn-danger delete" data-toggle="modal" data-target="#modal" data-account="${row.accountNumber},${row.accountName}">Delete <i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
                });
            } else {
                tableRows += `
                        <tr>
                            <td colspan="6">No Data</td>
                        </tr>
                    `;
            }
            $('#data-account').html(tableRows);
        }, error: (err) => {
            console.error(err);
        }
    });
}
loadData();

$('#modal').on('hidden.bs.modal', () => {
    $('#modalLabel').html(`Loading <i class="fas fa-spinner fa-spin"></i>`);
    $('#modalBody').html(`Loading <i class="fas fa-spinner fa-spin"></i>`);
    $('#modalFooter').html(`Loading <i class="fas fa-spinner fa-spin"></i>`);
    $('#modalDialog').removeClass('modal-lg');
});
$('#add').click(() => {
    $('#modalLabel').html('Add New Account');
    $('#modalBody').html(`
            <form id="formAdd">
                <div class="form-group">
                    <label for="accountNumber">Account Number</label>
                    <input type="text" class="form-control" id="accountNumber" placeholder="Enter..." required>
                </div>
                <div class="form-group">
                    <label for="accountName">Account Name</label>
                    <input type="text" class="form-control" id="accountName" placeholder="Enter..." required>
                </div>
                <div class="form-group">
                    <label for="accountBalance">Account Balance</label>
                    <input type="number" class="form-control" id="accountBalance" placeholder="Enter..." required>
                </div>
            </form>
        `);
    $('#modalFooter').html(`
            <button  class="btn btn-secondary" data-dismiss="modal">${closeButton}</button>
            <button id="submitAdd" class="btn btn-primary">${saveButton}</button>
        `);
    $('#submitAdd').click(() => {
        $.ajax({
            url: '/api/addAccount',
            type: 'PUT',
            data: JSON.stringify({
                accountNumber: $('#accountNumber').val() != '' ? $('#accountNumber').val() : null,
                accountName: $('#accountName').val() != '' ? $('#accountName').val() : null,
                accountBalance: $('#accountBalance').val() != '' ? $('#accountBalance').val() : null
            }),
            contentType: "application/json; charset=utf-8",
            beforeSend: () => {
                loadingButton('#submitAdd', true);
            },
            success: (data) => {
                loadingButton('#submitAdd', true, saveButton);
                notification('#formAdd', 'success', data.message);
                loadData();
                setTimeout(() => {
                    $('#modal').modal('hide');
                }, 2000);
            },
            error: (err) => {
                loadingButton('#submitAdd', false, saveButton);
                notification('#formAdd', 'danger', err.responseJSON.message);
                loadData();
            }
        });

    })
});
$(document).on('click', '.use', (e) => {
    e.preventDefault();
    let id = e.target.id;
    let account = $(`#${id}`).data('account').split(',');
    $('#modalLabel').html('Use Account');
    $('#modalBody').html(`
            <form id="formUse">
                <div class="form-group">
                    <label for="accountNumberSender">Account Sender</label>
                    <select id="accountNumberSender" class="custom-select form-control" readonly required>
                      <option selected value="${account[0]}">${account[1]} (${account[0]})</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="accountNumberReceiver">Account Number Receiver <i id="defaultSpin" class="fas fa-spinner fa-spin"></i></label>
                    <select id="accountNumberReceiver" class="custom-select form-control" required></select>
                </div>
                <div class="form-group">
                    <label for="amount">Amount</label>
                    <input type="number" class="form-control" id="amount" placeholder="Enter..." required>
                </div>
            </form>
        `);
    $.ajax({
        url: `/api/getAccounts`,
        type: 'GET',
        success: (data) => {
            $('#defaultSpin').hide();
            let optionData = `<option selected value="">Choose account</option>`;
            data.filter((row)=> row.accountNumber !== account[0]).forEach((row) => {
                optionData += `
                        <option value="${row.accountNumber}">${row.accountName} (${row.accountNumber})</option>
                    `;
            });
            $('#accountNumberReceiver').html(optionData);
        },
        error: (err) => {
            notification('#formUse', 'danger', err.responseJSON.message);
        }
    });
    $('#modalFooter').html(`
            <button class="btn btn-secondary" data-dismiss="modal">${closeButton}</button>
            <button id="submitUse" class="btn btn-success" data-account="${account}">${sendButton}</button>
        `);
    $('#submitUse').click((e) => {
        let account = $(`#submitUse`).data('account').split(',');
        $.ajax({
            url: `/api/transferBalance`,
            type: 'POST',
            data: JSON.stringify({
                accountNumberSender: $('#accountNumberSender').val() != '' ? $('#accountNumberSender').val() : null,
                accountNumberReceiver: $('#accountNumberReceiver').val() != '' ? $('#accountNumberReceiver').val() : null,
                amount: $('#amount').val() != '' ? $('#amount').val() : null
            }),
            contentType: "application/json; charset=utf-8",
            beforeSend: () => {
                loadingButton('#submitUse', true);
            },
            success: (data) => {
                loadingButton('#submitUse', true, sendButton);
                notification('#formUse', 'success', data.message);
                loadData();
                setTimeout(() => {
                    $('#modal').modal('hide');
                }, 2000);
            },
            error: (err) => {
                loadingButton('#submitUse', false, sendButton);
                notification('#formUse', 'danger', err.responseJSON.message);
                loadData();
            }
        });
    })
});
$(document).on('click', '.history', (e) => {
    e.preventDefault();
    $('#modalDialog').addClass('modal-lg');
    let id = e.target.id;
    let account = $(`#${id}`).data('account').split(',');
    $('#modalLabel').html('History Transaction Account');
    $('#modalBody').html(`
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>Account</td>
                            <td>: ${account[1]} (${account[0]})</td>
                        </tr>
                        <tr>
                            <td>Balance</td>
                            <td>: ${formatCurrency(account[2])}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div id="tableHistory" class="table-responsive" style="margin-top: 20px;">
                <table class="table table-striped text-center">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody id="data-history">
                        <tr>
                            <td colspan="4">
                                Loading <i class="fas fa-spinner fa-spin"></i>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `);
    $.ajax({
        url: `/api/getTransaction/${account[0]}`,
        type: 'GET',
        success: (data) => {
            let tableRows = '';
            if (data.length) {
                let textColor;
                data.sort((left,right) => {
                    if (left.transactionTime > right.transactionTime) return -1;
                    if (left.transactionTime < right.transactionTime) return 1;
                    return 0;
                }).forEach((row, i) => {
                    textColor = row.transactionAmount[0] === '+' ? 'success' : 'danger';
                    tableRows += `
                            <tr>
                                <td>${i+1}</td>
                                <td>${row.transactionName}</td>
                                <td class="text text-${textColor}">${insertString(row.transactionAmount,1)}</td>
                                <td>${new Date(row.transactionTime).toLocaleString()}</td>
                            </tr>
                        `;
                });
            } else {
                tableRows += `
                        <tr>
                            <td colspan="4">No Data</td>
                        </tr>
                    `;
            }
            $('#data-history').html(tableRows);
        },
        error: (err) => {
            notification('#tableHistory', 'danger', err.responseJSON.message);
            loadData();
        }
    });
    $('#modalFooter').html(`
            <button class="btn btn-secondary" data-dismiss="modal">${closeButton}</button>
        `);
});
$(document).on('click', '.edit', (e) => {
    e.preventDefault();
    let id = e.target.id;
    let account = $(`#${id}`).data('account').split(',');
    $('#modalLabel').html('Edit Account');
    $('#modalBody').html(`
            <form id="formEdit">
                <div class="form-group">
                    <label for="accountName">Account Name</label>
                    <input type="text" class="form-control" id="accountName" placeholder="Enter..." value="${account[1]}" required>
                </div>
            </form>
        `);
    $('#modalFooter').html(`
            <button class="btn btn-secondary" data-dismiss="modal">${closeButton}</button>
            <button id="submitEdit" class="btn btn-success" data-account="${account}">${saveButton}</button>
        `);
    $('#submitEdit').click((e) => {
        let account = $(`#submitEdit`).data('account').split(',');
        $.ajax({
            url: `/api/editAccount`,
            type: 'PATCH',
            data: JSON.stringify({
                accountNumber: account[0],
                accountName: $('#accountName').val() != '' ? $('#accountName').val() : null,
            }),
            contentType: "application/json; charset=utf-8",
            beforeSend: () => {
                loadingButton('#submitEdit', true);
            },
            success: (data) => {
                loadingButton('#submitEdit', true, saveButton);
                notification('#formEdit', 'success', data.message);
                loadData();
                setTimeout(() => {
                    $('#modal').modal('hide');
                }, 2000);
            },
            error: (err) => {
                loadingButton('#submitEdit', false, yesButton);
                notification('#formEdit', 'danger', err.responseJSON.message);
                loadData();
            }
        });
    })
});
$(document).on('click', '.delete', (e) => {
    e.preventDefault();
    let id = e.target.id;
    let account = $(`#${id}`).data('account').split(',');
    $('#modalLabel').html('Delete Account');
    $('#modalBody').html(`
            <div id="formDelete">
                <p class="text-center">Are you sure to delete this account: ${account[1]} (${account[0]})?</p>
            </div>
        `);
    $('#modalFooter').html(`
            <button class="btn btn-danger" data-dismiss="modal">${noButton}</button>
            <button id="submitDelete" class="btn btn-success" data-account="${account}">${yesButton}</button>
        `);
    $('#submitDelete').click((e) => {
        let account = $(`#submitDelete`).data('account').split(',');
        $.ajax({
            url: `/api/deleteAccount/${account[0]}`,
            type: 'DELETE',
            beforeSend: () => {
                loadingButton('#submitDelete', true);
            },
            success: (data) => {
                loadingButton('#submitDelete', true, yesButton);
                notification('#formDelete', 'success', data.message);
                loadData();
                setTimeout(() => {
                    $('#modal').modal('hide');
                }, 2000);
            },
            error: (err) => {
                loadingButton('#submitDelete', false, yesButton);
                notification('#formDelete', 'danger', err.responseJSON.message);
                loadData();
            }
        });
    })
});