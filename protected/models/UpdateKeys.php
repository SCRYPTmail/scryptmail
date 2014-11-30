<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class UpdateKeys extends CFormModel
{

	public $email;
	public $seedPrK;
	public $seedPubK;
	public $mailPrK;
	public $mailPubK;

	public $sendObj;


	public function rules()
	{
		return array(
			array('sendObj', 'validateObj', 'on' => 'saveKeys'),
			array('sendObj', 'validateSecretObj', 'on' => 'saveSecret'),
			array('sendObj', 'validateTokObj', 'on' => 'generateToken'),
		);
	}

	public function validateTokObj()
	{
		if (isset($this->sendObj) && is_array($this->sendObj)) {
			if (isset($this->sendObj['tokenHash']) &&
				isset($this->sendObj['OldModKey'])&&
				isset($this->sendObj['mailHash']) &&
				isset($this->sendObj['tokenAesHash'])
			) {
				return true;
			} else
				$this->addError('sendObj', 'not valid');

		} else
			$this->addError('sendObj', 'empty');
	}

	public function validateSecretObj()
	{
		if (isset($this->sendObj) && is_array($this->sendObj)) {
			if (isset($this->sendObj['userObj']) &&
				isset($this->sendObj['NewModKey']) &&
				isset($this->sendObj['OldModKey'])&&
				isset($this->sendObj['mailHash'])
			) {
				return true;
			} else
				$this->addError('sendObj', 'not valid');

		} else
			$this->addError('sendObj', 'empty');
	}

	public function generateToken($id){

		$param[':oldModKey'] = hash('sha512', $this->sendObj['OldModKey']);
		$param[':id'] = $id;
		$param[':mailHash']=$this->sendObj['mailHash'];
		$param[':tokenHash']=$this->sendObj['tokenHash'];
		$param[':tokenAesHash']=$this->sendObj['tokenAesHash'];

		$trans = Yii::app()->db->beginTransaction();
		if (
			Yii::app()->db->createCommand("UPDATE user SET tokenHash=:tokenHash,tokenAesHash=:tokenAesHash WHERE id=:id AND modKey=:oldModKey AND mailHash=:mailHash")->execute($param)){
				$trans->commit();
				echo '{"email":"good"}';
			} else {
				$trans->rollback();
				echo '{"email":"Token not saved"}';

			}

	}

	public function validateObj()
	{
		if (isset($this->sendObj) && is_array($this->sendObj)) {
			if (isset($this->sendObj['userObj']) &&
				isset($this->sendObj['NewModKey']) &&
				isset($this->sendObj['OldModKey']) &&
				isset($this->sendObj['mailKey']) &&
				isset($this->sendObj['seedKey']) &&
				isset($this->sendObj['mailHash']) &&
				isset($this->sendObj['sigKey'])
			) {
				return true;
			} else
				$this->addError('sendObj', 'not valid');

		} else
			$this->addError('sendObj', 'empty');
	}
	public function saveSecret($id)
	{
		$param[':oldModKey'] = hash('sha512', $this->sendObj['OldModKey']);
		$param[':userObj'] = $this->sendObj['userObj'];
		$param[':id'] = $id;
		$param[':newModKey'] = $this->sendObj['NewModKey'];
		$param[':mailHash']=$this->sendObj['mailHash'];
		$param[':tokenHash']=$this->sendObj['tokenHash'];
		$param[':tokenAesHash']=$this->sendObj['tokenAesHash'];

		$trans = Yii::app()->db->beginTransaction();
		if (
			Yii::app()->db->createCommand("UPDATE user SET userObj=:userObj,modKey=:newModKey,tokenHash=:tokenHash,tokenAesHash=:tokenAesHash WHERE id=:id AND modKey=:oldModKey AND mailHash=:mailHash")->execute($param)){

			unset($param[':id'],$param[':userObj'],$param[':tokenHash'],$param[':tokenAesHash']);

		if(Yii::app()->db->createCommand("UPDATE public_exchange SET modKey=:newModKey WHERE modKey=:oldModKey AND mailHash=:mailHash")->execute($param)
		) {
			$trans->commit();
			echo '{"email":"good"}';
		} else {
			$trans->rollback();
			echo '{"email":"Keys are not saved, please try again or report a bug"}';

		}
	}
	}

	public function saveKeys()
	{

		$param[':oldModKey'] = hash('sha512', $this->sendObj['OldModKey']);
		$param[':userObj'] = $this->sendObj['userObj'];
		$param[':id'] = Yii::app()->user->getId();
		$param[':newModKey'] = $this->sendObj['NewModKey'];


		$trans = Yii::app()->db->beginTransaction();
		//print_r($param);
		if (
			Yii::app()->db->createCommand("UPDATE user SET userObj=:userObj,modKey=:newModKey WHERE id=:id AND modKey=:oldModKey")->execute($param) &&
			UserGroupManager::updateKeys($this->sendObj['mailHash'], $this->sendObj['seedKey'], $this->sendObj['mailKey'], $this->sendObj['sigKey'], $this->sendObj['NewModKey'], $param[':oldModKey'])
		) {
			$trans->commit();
			echo '{"email":"good"}';
		} else {
			$trans->rollback();
			echo '{"email":"Keys are not saved, please try again or report a bug"}';

		}


	}

	public function updateKey()
	{

		$this->email = isset($_POST["CreateUser"]['email']) ? $_POST["CreateUser"]['email'] : '';
		$this->seedPrK = isset($_POST["CreateUser"]['seedPrK']) ? $_POST["CreateUser"]['seedPrK'] : '';
		$this->seedPubK = isset($_POST["CreateUser"]['seedPrK']) ? $_POST["CreateUser"]['seedPubK'] : '';
		$this->mailPrK = isset($_POST["CreateUser"]['seedPrK']) ? $_POST["CreateUser"]['mailPrK'] : '';
		$this->mailPubK = isset($_POST["CreateUser"]['seedPrK']) ? $_POST["CreateUser"]['mailPubK'] : '';


	}


}
