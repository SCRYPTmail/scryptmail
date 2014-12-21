<div class="form-horizontal" id="email-compose-form">

		<h2  class="row email-open-header">
		Compose Email
	</h2>

	<div class="inbox-info-bar no-padding">
		<div class="row">
			<div class="form-group">
				<label class="control-label col col-xs-1"><strong>To</strong></label>

				<div class="col col-xs-10">
					<input type="hidden" id="toRcpt" style="width:100%;"/>
				</div>
			</div>
		</div>
	</div>

	<div class="inbox-info-bar no-padding">
		<div class="row">
			<div class="form-group">
				<label class="control-label col col-xs-1"><strong>Subject</strong></label>

				<div class="col col-xs-11">
					<input class="form-control" placeholder="Email Subject" type="text" id="subj" maxlength="150">
					<em><a href="javascript:void(0);" class="show-next" rel="tooltip" data-placement="bottom"
						   data-original-title="Attachments"><i class="fa fa-paperclip fa-lg"></i></a></em>
				</div>
			</div>
		</div>
	</div>

	<div class="inbox-info-bar no-padding hidden">
		<div class="row">
			<div class="form-group">

				<label class="control-label pull-left" style="margin-left:15px;">
					<button onclick="fileSelector.click()" class="btn btn-primary btn-xs">Attachments</button></label>

				<div class="col col-xs-10 pull-left">
					<input type="hidden" id="atachFiles" style="width:100%;margin-top:2px;"/>
				</div>
				<div class="col-md-11">
					<input type="file" id="ddd" name="files" onchange="getFile($(this))" style="display:none;"/>

				</div>
			</div>
		</div>
	</div>
	<div class="inbox-message no-padding" onclick="$('.note-editable').focus();">

		<div id="emailbody">

		</div>
	</div>

	<div class="inbox-compose-footer">

		<span id="composeEmailPin"></span>

	</div>

</div>

<div id="dialog-form-pin" title="Your email PIN" style="display:none;">
	<p class="validateTips" style="display:block;border:0px;font-size:14px;">
		Email that send from our server should be protected by PIN. Please SAVE this PIN and share it with your
		recipients, so they can decrypt this email.</p>

	<form id="dialog-form1-pin">
		<fieldset>
			<label for="name">PIN: </label>
			<input type="text" name="name" id="pin" class="text ui-widget-content ui-corner-all"
				   disabled="disabled">
		</fieldset>
	</form>
</div>

<div id="dialog-form-reqkeys" title="Your email PIN" style="display:none;overflow-x:hidden;">
	<p class="validateTips" style="display:block;border:0px;">Email address: <b><span id="emaddrs1"></span> </b> is not
		registered in our system. In such case you may REMOVE recipient or PROVIDE public keys, that user will use after
		registration. </p>

	<form id="dialog-form1-reqkeys" class="smart-form">

		<div class="row">
			<section class="col col-6">
				<label class="textarea">
					<textarea rows="4" name="UpdateKeys[seedPubK]"
							  placeholder="Seed Public Key - This key is used to encrypt message seed. Key strength between 512-2048 bits."
							  class="valid" id="ReqKeys_seedPubK" spellcheck="false"
							  oninput="validateSeedKeysFromUser();"></textarea>
				</label>
			</section>

			<section class="col col-6">
				<label class="textarea">
					<textarea rows="4" name="UpdateKeys[mailPubK]"
							  placeholder="Mail Public Key - This key is used to encrypt message body. Key strength between 1024-4096 bits."
							  class="valid" id="ReqKeys_mailPubK" spellcheck="false"
							  oninput="validateMailKeysFromUser();"></textarea>
				</label>
			</section>
		</div>
	</form>
</div>


<div id="dialog-form-keys" title="Email not found" style="display:none;overflow-x:hidden;">
	<p class="validateTips" style="display:block;border:0px;">Email address: <b><span id="emaddrs"></span> </b> is not
		registered in our system. In such case you may REMOVE recipient or click cancel to edit.</p>
</div>
<script src="/js/composeEmail.js?r=<?php echo $version;?>"></script>

