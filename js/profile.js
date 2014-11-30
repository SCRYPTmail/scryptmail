/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 2:30 PM
 */
$(document).ready(function () {

	activePage = 'profile';
	currentTab();
	$('#newFname').attr('name',makerandom());

	contactListProfileInitialized=false;

});

function changeTimeout(tim){

	if (!isNaN(tim.val())) {
		profileSettings['sessionExpiration']=parseInt(tim.val());
		sessionTimeOut=parseInt(tim.val());
		checkProfile();
		Answer('Saved');
	}
	//console.log(tim.val());
}

function saveProfileName() {
	profileSettings['name'] = stripHTML($('#newFname').val());
	checkProfile();
	populateProfile();
}

function gotoUpdateKeys() {

	checkState(function () {
		var user = validateUserObject();
		var role = validateUserRole();
		var seedKey = role['role']['seedMaxKeyLength'];
		console.log(role['role']['seedMaxKeyLength']);
		var mailKey = role['role']['mailMaxKeyLength'];

		$('#UpdateKeys_seedPrK').attr('name', makerandom());
		$('#UpdateKeys_mailPrK').attr('name', makerandom());
		$('#UpdateKeys_seedPubK').attr('name', makerandom());
		$('#UpdateKeys_mailPubK').attr('name', makerandom());
		//calcPerformance();
		//console.log('gggg');
		narrowSelections(seedKey);
	}, function () {

	});
}

function retrieveKeys() {

	provideSecret(function (secret) {
		if (userObj = validateUserObject()) {
			var user = dbToProfile(userObj, secret);

			user1 = JSON.parse(user, true);

			$('#UpdateKeys_seedPrK').val(from64(user1['SeedPrivate']));
			$('#UpdateKeys_seedPubK').val(from64(user1['SeedPublic']));
			$('#UpdateKeys_mailPrK').val(from64(user1['MailPrivate']));
			$('#UpdateKeys_mailPubK').val(from64(user1['MailPublic']));
			validateSeedKeys();
			validateMailKeys();
		}
	}, function () {

	});
}

function validateSeedKeys() {
	var pki = forge.pki;
	if ($('#UpdateKeys_seedPrK').val() != '' && $('#UpdateKeys_seedPubK').val() != '') {
		try {
			var sprivateKey = pki.privateKeyFromPem($('#UpdateKeys_seedPrK').val());
			var spublicKey = pki.publicKeyFromPem($('#UpdateKeys_seedPubK').val());

			var sencrypted = spublicKey.encrypt('test', 'RSA-OAEP');
			var sdecrypted = sprivateKey.decrypt(sencrypted, 'RSA-OAEP');

			if (sdecrypted == "test") {
				$('#UpdateKeys_seedPrK').parent().removeClass('state-error');
				$('#UpdateKeys_seedPubK').parent().removeClass('state-error');
				$('#UpdateKeys_seedPrK').parent().addClass('state-success');
				$('#UpdateKeys_seedPubK').parent().addClass('state-success');
			} else {
				$('#UpdateKeys_seedPrK').parent().removeClass('state-success');
				$('#UpdateKeys_seedPubK').parent().removeClass('state-success');
				$('#UpdateKeys_seedPrK').parent().addClass('state-error');
				$('#UpdateKeys_seedPubK').parent().addClass('state-error');
			}

		}
		catch (err) {
			$('#UpdateKeys_seedPrK').parent().removeClass('state-success');
			$('#UpdateKeys_seedPubK').parent().removeClass('state-success');
			$('#UpdateKeys_seedPrK').parent().addClass('state-error');
			$('#UpdateKeys_seedPubK').parent().addClass('state-error');
		}
	} else {
		$('#UpdateKeys_seedPrK').parent().removeClass('state-success');
		$('#UpdateKeys_seedPubK').parent().removeClass('state-success');
		$('#UpdateKeys_seedPrK').parent().removeClass('state-error');
		$('#UpdateKeys_seedPubK').parent().removeClass('state-error');
	}

}

function validateMailKeys() {
	var pki = forge.pki;

	if ($('#UpdateKeys_mailPrK').val() != '' && $('#UpdateKeys_mailPubK').val() != '') {
		try {
			var mprivateKey = pki.privateKeyFromPem($('#UpdateKeys_mailPrK').val());
			var mpublicKey = pki.publicKeyFromPem($('#UpdateKeys_mailPubK').val());
			var mencrypted = mpublicKey.encrypt('test', 'RSA-OAEP');
			var mdecrypted = mprivateKey.decrypt(mencrypted, 'RSA-OAEP');
			if (mdecrypted == "test") {
				$('#UpdateKeys_mailPrK').parent().removeClass('state-error');
				$('#UpdateKeys_mailPubK').parent().removeClass('state-error');
				$('#UpdateKeys_mailPrK').parent().addClass('state-success');
				$('#UpdateKeys_mailPubK').parent().addClass('state-success');
			} else {
				$('#UpdateKeys_mailPrK').parent().removeClass('state-success');
				$('#UpdateKeys_mailPubK').parent().removeClass('state-success');
				$('#UpdateKeys_mailPrK').parent().addClass('state-error');
				$('#UpdateKeys_mailPubK').parent().addClass('state-error');
			}
		}
		catch (err) {
			$('#UpdateKeys_mailPrK').parent().removeClass('state-success');
			$('#UpdateKeys_mailPubK').parent().removeClass('state-success');
			$('#UpdateKeys_mailPrK').parent().addClass('state-error');
			$('#UpdateKeys_mailPubK').parent().addClass('state-error');
		}

	} else {
		$('#UpdateKeys_mailPrK').parent().removeClass('state-success');
		$('#UpdateKeys_mailPubK').parent().removeClass('state-success');
		$('#UpdateKeys_mailPrK').parent().removeClass('state-error');
		$('#UpdateKeys_mailPubK').parent().removeClass('state-error');
	}

}

function generateKeys() {

	var selected = 0;
	var rsa = forge.pki.rsa;
	var pki = forge.pki;

	if ($('#UpdateKeys_mode_0').is(':checked')) {
		var seedpair = rsa.generateKeyPair({bits: 512, e: 0x10001});
		var mailpair = rsa.generateKeyPair({bits: 1024, e: 0x10001});
		selected = 1;

	}
	if ($('#UpdateKeys_mode_1').is(':checked')) {
		var seedpair = rsa.generateKeyPair({bits: 1024, e: 0x10001});
		var mailpair = rsa.generateKeyPair({bits: 2048, e: 0x10001});
		selected = 1;
	}
	if ($('#UpdateKeys_mode_2').is(':checked')) {
		var seedpair = rsa.generateKeyPair({bits: 2048, e: 0x10001});
		var mailpair = rsa.generateKeyPair({bits: 4096, e: 0x10001});
		selected = 1;
	}

	if (selected == 0) {
		noAnswer('Please select Key Strength');
	} else {
		$('#UpdateKeys_seedPrK').val(pki.privateKeyToPem(seedpair.privateKey));
		$('#UpdateKeys_seedPubK').val(pki.publicKeyToPem(seedpair.publicKey));

		$('#UpdateKeys_mailPrK').val(pki.privateKeyToPem(mailpair.privateKey));
		$('#UpdateKeys_mailPubK').val(pki.publicKeyToPem(mailpair.publicKey));
	}
	validateSeedKeys();
	validateMailKeys();

}

function generateSigKeys() {

	var rsa = forge.pki.rsa;
	var pki = forge.pki;

	var sigpair = rsa.generateKeyPair({bits: 1024, e: 0x10001});

	sigPrivateKey = sigpair.privateKey;
	sigPubKey = sigpair.publicKey;


}

function saveKeys() {
	if ($('#UpdateKeys_seedPubK').val() != '' && $('#UpdateKeys_mailPubK').val() != '') {


		checkState(function () {
			provideSecret(function (secret) {
				if (validatePublics()) {

					var userObj = userData;

					var pki = forge.pki;
					var dfd = $.Deferred();

					var user = dbToProfile(userObj, secret);
					user = JSON.parse(user);

					var NuserObj = [];
					NuserObj['userObj'] = {};

					NuserObj['userObj']['SeedPublic'] = to64($('#UpdateKeys_seedPubK').val()); //seedPb
					NuserObj['userObj']['SeedPrivate'] = to64($('#UpdateKeys_seedPrK').val()); //seedPr
					NuserObj['userObj']['MailPublic'] = to64($('#UpdateKeys_mailPubK').val()); //mailPb
					NuserObj['userObj']['MailPrivate'] = to64($('#UpdateKeys_mailPrK').val()); //mailPr

					try {
						NuserObj['userObj']['SignaturePrivate'] = to64(pki.privateKeyToPem(sigPrivateKey));
						NuserObj['userObj']['SignaturePublic'] = to64(pki.publicKeyToPem(sigPubKey));
					} catch (err) {
						noAnswer('Keys are corrupted. Please generate new signature keys');
					}


					NuserObj['userObj']['folderKey'] = to64(forge.util.bytesToHex(folderKey));
					NuserObj['userObj']['modKey'] = makeModKey(userObj['saltS']);

					NuserObj['secret'] = secret;
					NuserObj['saltS'] = userObj['saltS'];

					var NewObj = profileToDb(NuserObj);

					var presend = {'OldModKey': userModKey, 'mailKey': NuserObj['userObj']['MailPublic'], 'seedKey': NuserObj['userObj']['SeedPublic'], 'sigKey': NuserObj['userObj']['SignaturePublic'], 'userObj': NewObj.toString(), 'NewModKey': SHA512(NuserObj['userObj']['modKey']), 'mailHash': SHA512(profileSettings['email'])};

					$.ajax({
						type: "POST",
						url: '/updateKeys',
						data: {
							'sendObj': presend
						},
						success: function (data, textStatus) {
							if (data.email != 'good') {
								noAnswer('Error occurred. Please try again or report a bug');
							} else {
								userModKey = NuserObj['userObj']['modKey'];
								Answer('Successfully Saved!');
								dfd.resolve();
							}

						},
						error: function (data, textStatus) {
							noAnswer('Error occurred. Try again');
						},
						dataType: 'json'
					});

					dfd.done(function () {
						$('#keyGenForm')[0].reset();
						console.log('ddddd');
						getMainData();
					});


				} else
					noAnswer('Key size bigger than allowed by plan, please upgrade the plan or choose lesser key strength');

			}, function () {
			});
		}, function () {
		});
	} else {
		noAnswer('Provide New Keys before save');
	}
}

function initSavePass() {

	$('#passwordOld').attr('name', makerandom());
	$('#passwordNew').attr('name', makerandom());
	$('#passwordNewRep').attr('name', makerandom());

	validator = $("#smart-form-changepass").validate();

	$("#passwordOld").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80
	});

	$("#passwordNew").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80
	});

	$("#passwordNewRep").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80,
		equalTo: '#passwordNew',
		messages: {
			required: 'Please enter your password one more time',
			equalTo: 'Please enter the same password as above'
		}
	});
}

function savePassword() {

	validator.form();

	if (validator.numberOfInvalids() == 0) {

		//var oldPas = SHA512($('#passwordOld').val());
		//var newPas = SHA512($('#passwordNew').val());

		checkState(function () {
			$.ajax({
				type: "POST",
				url: '/changePass',
				data: {
					'oldPass': SHA512($('#passwordOld').val()),
					'newPass': SHA512($('#passwordNew').val())
				},
				success: function (data, textStatus) {
					if (data['result'] == 'success') {
						Answer('Saved');
						$("#smart-form-changepass")[0].reset();
					} else
						$.ajax({
							type: "POST",
							url: '/changePass',
							data: {
								'oldPass': SHA512old($('#passwordOld').val()),
								'newPass': SHA512($('#passwordNew').val())
							},
							success: function (data, textStatus) {
								if (data['result'] == 'success') {
									Answer('Saved');
									$("#smart-form-changepass")[0].reset();
								} else
									noAnswer('Failed to save. Try Again');
							},
							error: function (data, textStatus) {
								noAnswer('Error occured. Try Again')
							},
							dataType: 'json'
						});
				},
				error: function (data, textStatus) {
					noAnswer('Error occured. Try Again')
				},
				dataType: 'json'
			});
		}, function () {
		});
	}
}

function initSaveSecret() {
	$('#newSec').attr('name', makerandom());
	$('#repeatSec').attr('name', makerandom());


	validatorSecret = $("#smart-form-secret").validate();

	$("#newSec").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80
	});

	$("#repeatSec").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80,
		equalTo: '#newSec',
		messages: {
			required: 'Please enter your Secret one more time',
			equalTo: 'Please enter the same password as above'
		}
	});

}

function downloadTokenProfile()
{
	checkState(function () {
		provideSecret(function (secret) {
			getObjects()
				.always(function (data) {
					if (data.userData && data.userRole) {
						var tempPro = JSON.parse(dbToProfile(data['userData'], secret));

						var secretnew = secret;
						var salt=forge.util.hexToBytes(data.userData['saltS']);
						var derivedKey = makeDerived(secretnew, salt);
						var Test = forge.util.bytesToHex(derivedKey);
						var Part2 = Test.substr(64, 128);
						var keyA = forge.util.hexToBytes(Part2);
						var token = forge.random.getBytesSync(256);
						var tokenHash=SHA512(token);
						var tokenAes=toAesToken(keyA, token);
						var tokenAesHash=SHA512(tokenAes);



						var presend = {
							'OldModKey': tempPro['modKey'],
							'tokenHash':tokenHash,
							'tokenAesHash':tokenAesHash,
							'mailHash': SHA512(profileSettings['email'])
						};
						$.ajax({
							type: "POST",
							url: '/generateNewToken',
							data: {
								'sendObj': presend
							},
							success: function (data, textStatus) {
								if (data.email != 'good') {
									noAnswer('Error occurred. Please try again or report a bug');
								} else {
									toFile=tokenAes;
									downloadToken();
									Answer('Saved!');
								}

							},
							error: function (data, textStatus) {
								noAnswer('Error occurred. Try again');
							},
							dataType: 'json'
						});
					} else
						noAnswer('Error occurred. Try again');
				});

		}, function () {
		});
	}, function () {
	});

}

function saveSecret() {
	validatorSecret.form();

	if (validatorSecret.numberOfInvalids() == 0) {

		checkState(function () {
			provideSecret(function (secret) {
				getObjects()
					.always(function (data) {
						if (data.userData && data.userRole) {

							var tempPro = JSON.parse(dbToProfile(data['userData'], secret));

							var NuserObj = [];
							NuserObj['userObj'] = {};

							NuserObj['userObj']['SeedPublic'] = tempPro['SeedPublic'];
							NuserObj['userObj']['SeedPrivate'] = tempPro['SeedPrivate'];
							NuserObj['userObj']['MailPublic'] = tempPro['MailPublic'];
							NuserObj['userObj']['MailPrivate'] = tempPro['MailPrivate'];

							NuserObj['userObj']['SignaturePrivate'] = tempPro['SignaturePrivate'];
							NuserObj['userObj']['SignaturePublic'] = tempPro['SignaturePublic'];

							NuserObj['userObj']['folderKey'] = tempPro['folderKey'];
							NuserObj['userObj']['modKey'] = makeModKey(data.userData['saltS']);

							NuserObj['secret'] = $('#newSec').val();
							NuserObj['saltS'] = data.userData['saltS'];

							var NewObj = profileToDb(NuserObj);
							//----------------------------------------------------

							var secretnew = $('#newSec').val();
							var salt=forge.util.hexToBytes(data.userData['saltS']);

							var derivedKey = makeDerived(secretnew, salt);

							var Test = forge.util.bytesToHex(derivedKey);
							var Part2 = Test.substr(64, 128);

							var keyA = forge.util.hexToBytes(Part2);

							var token = forge.random.getBytesSync(256);
							var tokenHash=SHA512(token);

							var tokenAes=toAesToken(keyA, token);
							var tokenAesHash=SHA512(tokenAes);



							var presend = {
								'OldModKey': tempPro['modKey'],
								'userObj': NewObj.toString(),
								'NewModKey': SHA512(NuserObj['userObj']['modKey']),
								'mailHash': SHA512(profileSettings['email']),
								'tokenHash':tokenHash,
								'tokenAesHash':tokenAesHash
							};
							$.ajax({
								type: "POST",
								url: '/saveSecret',
								data: {
									'sendObj': presend
								},
								success: function (data, textStatus) {
									if (data.email != 'good') {
										noAnswer('Error occurred. Please try again or report a bug');
									} else {
										userModKey = NuserObj['userObj']['modKey'];
										$('#smart-form-secret')[0].reset();

										toFile=tokenAes;
										downloadToken();
										Answer('Saved!');
										//dfd.resolve();
									}

								},
								error: function (data, textStatus) {
									noAnswer('Error occurred. Try again');
								},
								dataType: 'json'
							});
						} else
							noAnswer('Error occurred. Please Try again');
					});

			}, function () {
			});
		}, function () {
		});
	}
}

function initContacts() {
	if (!contactListProfileInitialized) {

		var dataSet = [];
		//console.log(contacts);
		if (Object.keys(contacts).length > 0) {
			$.each(contacts, function (index, value) {
				var el = [value['name'], index, '<a class="delete" href="javascript:void(0);" onclick="delContact($(this),\'' + index + '\');"><i class="fa fa-times fa-lg txt-color-red"></i></a>'];
				dataSet.push(el);
			});

		} else
			dataSet = [];


		contactTable = $('#contactList').dataTable({
			"sDom": "R<'dt-toolbar'" +
				"<'#contactSearch'f>" +
				"<'#contactIcons'>" +
				"<'col-sm-3 pull-right'l>" +
				"r>t" +
				"<'dt-toolbar-footer'" +
				"<'col-sm-6 col-xs-2'i>" +
				"<'#paginator'p>" +
				">",
			"columnDefs": [
				{ "sClass": 'col col-xs-4', "targets": 0},
				{ "sClass": 'col col-xs-4', "targets": 1 },
				{ "sClass": 'col col-xs-1 text-align-center', "targets": 2},
				{ 'bSortable': false, 'aTargets': [ 2 ] },
				{ "orderDataType": "data-sort", "targets": 1 }
			],
			"order": [
				[ 1, "asc" ]
			],
			"iDisplayLength": 10,
			"data": dataSet,
			columns: [
				{ "title": "name" },
				{ "title": "email"},
				{ "title": "delete"}

			],
			"language": {
				"emptyTable": "No Contacts"
			}

		});

		contactListProfileInitialized = true;
		$('#contactIcons').html('<a class="btn btn-primary" style="width:50px;" href="javascript:void(0);" rel="tooltip" data-original-title="Add Contact" data-placement="bottom" onclick="addNewContact();"><i class="fa fa-plus"></i>&nbsp;&nbsp;<i class="fa fa-user"></i></a>')
		$('#contactIcons').css('float', 'left');


	}

}

function addNewContact() {

	$('#dialog-AddContact').dialog({
		autoOpen: false,
		height: 230,
		width: 300,
		modal: true,
		resizable: false,
		buttons: [
			{
				html: "<i class='fa fa-check'></i>&nbsp; Add",
				"class": "btn btn-primary pull-right",
				"id": 'loginok',
				click: function () {
					validatorNewClient.form();
					if (validatorNewClient.numberOfInvalids() == 0) {
						var name = $('#newClientName').val() != '' ? $('#newClientName').val() : 'Click to edit';
						var email = $('#newClientEmail').val().toLowerCase();
						var t = $('#contactList').DataTable();
						t.clear();
						contacts[email] = {'name': name};
						var dataSet = [];
						if (Object.keys(contacts).length > 0) {
							$.each(contacts, function (index, value) {
								var el = [value['name'], index, '<a class="delete" href="javascript:void(0);" onclick="delContact($(this),\'' + index + '\');"><i class="fa fa-times fa-lg txt-color-red"></i></a>'];
								dataSet.push(el);
							});
						}
						var addId = t.rows.add(dataSet)
						t.draw();
						//console.log(contacts);
						checkContacts();
						$('#dialog-AddContact').dialog('close');
					}
				}
			},
			{
				html: "<i class='fa fa-times'></i>&nbsp; Cancel",
				"class": "btn btn-warning pull-left",
				"id": 'loginclose',
				click: function () {
					$('#dialog-AddContact').dialog('close');
				}
			}
		],
		close: function () {
		}
	});

	$('#dialog-AddContact').dialog('open');


	$('#newClientName').attr('name', makerandom());
	$('#newClientEmail').attr('name', makerandom());


	validatorNewClient = $("#dialog-AddContact").validate();

	$("#newClientName").rules("add", {
		minlength: 2,
		maxlength: 60
	});

	$("#newClientEmail").rules("add", {
		required: true,
		email:true,
		minlength: 6,
		maxlength: 200
	});

}

