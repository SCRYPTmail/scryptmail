<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class SaveFolders extends CFormModel
{

	public $folderObj;
	public $modKey;


	public function rules()
	{
		return array(
			// username and password are required
			array('folderObj,modKey', 'required'),
			//	array('mailHash', 'numerical','integerOnly'=>true,'allowEmpty'=>true),
		);
	}


	public function save()
	{
		$params[':folderObj'] = $this->folderObj;
		$params[':modKey'] = hash('sha512', $this->modKey);
		$params[':id'] = Yii::app()->user->getId();

		if (Yii::app()->db->createCommand("UPDATE user SET folderObj=:folderObj WHERE modKey=:modKey AND id=:id")->execute($params))
			echo '{"response":"success"}';
		else
			echo '{"response":"fail"}';

	}

}