package sgq.cmd;

import javax.jdo.PersistenceManager;

import sgq.cmd.bean.Word;
import sgq.cmd.bean.WordSet;
import sgq.cmd.util.PMF;

import com.opensymphony.xwork2.ActionSupport;

public class InitWordSetAction extends ActionSupport {
	/**
	 * 
	 */
	private static final long serialVersionUID = -7273760748494707369L;
	
	private String result;
	
	public String execute() {
		PersistenceManager pm = PMF.get().getPersistenceManager();
		WordSet wordSet = new WordSet();
		wordSet.setName("testWordSet");
		Word word = new Word();
		word.setChinese("中国語");
		word.setHiragana("平仮名");
		word.setJapanese("日本語");
		word.setRemark("remark");
		wordSet.addWord(word);
		try {
			pm.makePersistent(wordSet);
			result = "ok";
		}
		finally {
			pm.close();
		}
		return SUCCESS;
	}

	public String getResult() {
		return result;
	}

	public void setResult(String result) {
		this.result = result;
	}
}
